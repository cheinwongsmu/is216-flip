import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase.js'
import { useAuthStore } from './auth.js'

function toCard(row) {
  return {
    id: row.id,
    front: row.front,
    back: row.back,
    isKnown: row.is_known
  }
}

function toDeck(row) {
  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    description: row.description,
    cards: (row.cards || []).map(toCard),
  }
}

export const useDeckStore = defineStore('deck', () => {
  const decks = ref([])

  const totalDecks = computed(() => decks.value.length)

  function getDeckById(id) {
    return decks.value.find((d) => d.id === id) ?? null
  }

  function masteryPercent(deckId) {
    const deck = getDeckById(deckId)
    if (!deck || deck.cards.length === 0) return 0
    const known = deck.cards.filter((c) => c.isKnown).length
    return Math.round((known / deck.cards.length) * 100)
  }

  async function loadDecks() {
    const auth = useAuthStore()
    // Fetch all decks belonging to the current user, each with its cards nested inside, 
    // newest deck first."
    const { data, error } = await supabase
      .from('decks')
      .select('*, cards(*)')
      .eq('user_uuid', auth.profile.user_uuid)
      .order('created_at', { ascending: false })

    if (!error && data) {
      decks.value = data.map(toDeck)
    }
  }

  async function createDeck({ title, subject, description }) {
    const auth = useAuthStore()

    const { data, error } = await supabase
      .from('decks')
      .insert({ title, subject, description, user_uuid: auth.profile.user_uuid })
      .select('id, title, subject, description')
      .single()
    if (error || !data) return null
    decks.value.push({ ...toDeck(data) })
    return data.id
  }

  async function updateDeck(deckId, updates) {
    const { cards: newCards, ...meta } = updates

    await supabase
      .from('decks')
      .update({ title: meta.title, subject: meta.subject, description: meta.description })
      .eq('id', deckId)

    let savedCards = newCards

    if (newCards !== undefined) {
      const cardsToInsert = newCards.filter((c) => !c.id)
      const cardsToUpdate = newCards.filter((c) => c.id)
      const results = []

      if (cardsToInsert.length > 0) {
        const { data, error } = await supabase
          .from('cards')
          .insert(
            cardsToInsert.map((c) => ({
              deck_id: deckId,
              front: c.front,
              back: c.back,
              is_known: c.isKnown ?? false,
            }))
          )
          .select()

        if (error) throw error
        results.push(...data)
      }

      if (cardsToUpdate.length > 0) {
        const { data, error } = await supabase
          .from('cards')
          .upsert(
            cardsToUpdate.map((c) => ({
              id: c.id,
              deck_id: deckId,
              front: c.front,
              back: c.back,
              is_known: c.isKnown ?? false,
            }))
          )
          .select()

        if (error) throw error
        results.push(...data)
      }

      savedCards = results.map(toCard)
      console.log(savedCards)

      const keepIds = savedCards.map((c) => c.id)
      if (keepIds.length > 0) {
        await supabase
          .from('cards')
          .delete()
          .eq('deck_id', deckId)
          .not('id', 'in', `(${keepIds.join(',')})`)
      } else {
        await supabase.from('cards').delete().eq('deck_id', deckId)
      }
    }
  }

  async function deleteDeck(deckId) {
    await supabase.from('decks').delete().eq('id', deckId)
    decks.value = decks.value.filter((d) => d.id !== deckId)
  }

  async function addCard(deckId, { front, back }) {
    const { data, error } = await supabase
      .from('cards')
      .insert({ deck_id: deckId, front, back, is_known: false })
      .select()
      .single()
    if (!error && data) {
      const deck = decks.value.find((d) => d.id === deckId)
      if (deck) deck.cards.push(toCard(data))
    }
  }

  async function addCards(deckId, cardList) {
    const rows = cardList.map((c) => ({ deck_id: deckId, front: c.front, back: c.back, is_known: false }))
    const { data, error } = await supabase.from('cards').insert(rows).select()
    if (!error && data) {
      const deck = decks.value.find((d) => d.id === deckId)
      if (deck) deck.cards.push(...data.map(toCard))
    }
  }

  async function deleteCard(deckId, cardId) {
    await supabase.from('cards').delete().eq('id', cardId)
    const deck = decks.value.find((d) => d.id === deckId)
    if (deck) deck.cards = deck.cards.filter((c) => c.id !== cardId)
  }

  async function markKnown(deckId, cardId) {
    supabase.from('cards').update({ is_known: true }).eq('id', cardId).then(() => { })
    const deck = decks.value.find((d) => d.id === deckId)
    if (deck) {
      const card = deck.cards.find((c) => c.id === cardId)
      if (card) card.isKnown = true
    }
  }

  async function markUnknown(deckId, cardId) {
    supabase.from('cards').update({ is_known: false }).eq('id', cardId).then(() => { })
    const deck = decks.value.find((d) => d.id === deckId)
    if (deck) {
      const card = deck.cards.find((c) => c.id === cardId)
      if (card) card.isKnown = false
    }
  }

  async function resetProgress(deckId) {
    await supabase.from('cards').update({ is_known: false }).eq('deck_id', deckId)
    const deck = decks.value.find((d) => d.id === deckId)
    if (deck) deck.cards.forEach((c) => (c.isKnown = false))
  }

  function shuffleCards(deckId) {
    const deck = decks.value.find((d) => d.id === deckId)
    if (!deck) return []
    const copy = [...deck.cards]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  function reset() {
    decks.value = []
  }

  return {
    decks, totalDecks,
    getDeckById, masteryPercent,
    loadDecks, createDeck, updateDeck, deleteDeck,
    addCard, addCards, deleteCard,
    markKnown, markUnknown, resetProgress, shuffleCards, reset,
  }
})

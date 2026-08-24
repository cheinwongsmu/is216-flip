import { ref, computed } from 'vue'

export function useStudySession(initialCards) {
  const cards = ref([...initialCards])
  const currentIndex = ref(0)
  const isFlipped = ref(false)
  const knownCount = ref(0)
  const unknownCount = ref(0)
  const reviewedSet = ref(new Set())

  const currentCard = computed(() => cards.value[currentIndex.value] ?? null)

  const isSessionComplete = computed(
    () => reviewedSet.value.size >= cards.value.length && cards.value.length > 0
  )

  function flip() {
    isFlipped.value = !isFlipped.value
  }

  function _advance() {
    isFlipped.value = false
    if (currentIndex.value < cards.value.length - 1) {
      currentIndex.value++
    }
  }

  function markKnown() {
    if (!currentCard.value) return
    reviewedSet.value.add(currentCard.value.id)
    knownCount.value++
    _advance()
  }

  function markUnknown() {
    if (!currentCard.value) return
    reviewedSet.value.add(currentCard.value.id)
    unknownCount.value++
    _advance()
  }

  function next() {
    if (currentIndex.value < cards.value.length - 1) {
      currentIndex.value++
      isFlipped.value = false
    }
  }

  function previous() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      isFlipped.value = false
    }
  }

  function shuffle() {
    const copy = [...cards.value]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]]
    }
    cards.value = copy
    currentIndex.value = 0
    isFlipped.value = false
  }

  function restartWithCards(newCards) {
    cards.value = [...newCards]
    currentIndex.value = 0
    isFlipped.value = false
    knownCount.value = 0
    unknownCount.value = 0
    reviewedSet.value = new Set()
  }

  return {
    cards,
    currentIndex,
    currentCard,
    isFlipped,
    knownCount,
    unknownCount,
    isSessionComplete,
    flip,
    markKnown,
    markUnknown,
    next,
    previous,
    shuffle,
    restartWithCards,
  }
}

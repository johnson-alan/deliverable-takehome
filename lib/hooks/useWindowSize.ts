import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const isClient = typeof window === 'object'

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
      scrollX: isClient ? window.scrollX : undefined,
      scrollY: isClient ? window.scrollY : undefined,
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (!isClient) return

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

export default useWindowSize

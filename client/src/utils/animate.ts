const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

export const animate = (from: number, to: number, t: number) => (cb: (x: number) => void) => {
  const diff = from - to
  const step = t / 15

  let acc = 0
  let timeout: number

  const start = () => {
    if (acc >= step) return
    acc += 1
    cb(from - diff * easeInOutQuad(acc / step))
    timeout = setTimeout(start, 15)
  }
  start()

  return () => void clearTimeout(timeout)
}

export const animateMulti = (arr: { from: number; to: number }[], t: number) => (
  cb: (x: number[]) => void
) => {
  let args: number[] = []
  let calls = 0

  const call = (n: number, i: number) => {
    calls += 1
    args[i] = n
    if (calls < arr.length) return
    cb(args)
    args = []
    calls = 0
  }

  const unsubs = arr.map((item, i) => animate(item.from, item.to, t)((n) => call(n, i)))
  return () => unsubs.forEach((x) => x())
}

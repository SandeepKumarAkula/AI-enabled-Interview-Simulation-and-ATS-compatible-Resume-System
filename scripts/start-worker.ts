import { startWorker } from '@/lib/worker'

async function main() {
  startWorker()
  // keep process alive
  process.stdin.resume()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

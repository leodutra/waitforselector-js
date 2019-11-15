async function waitForSelector(selector, opts = {}) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector)
        if (element) {
            resolve(element)
            return
        }
        const mutObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                const nodes = Array.from(mutation.addedNodes)
                for (const node of nodes) {
                    if (node.matches && node.matches(selector)) {
                        mutObserver.disconnect()
                        resolve(node)
                        return
                    }
                }
            }
        })
        mutObserver.observe(document.documentElement, { childList: true, subtree: true })
        if (opts.timeout) {
            setTimeout(() => {
                mutObserver.disconnect()
                if (opts.optional) {
                    resolve(null)
                } else {
                    reject(new Error(`Timeout exceeded while waiting for selector ("${selector}").`))
                }
            }, opts.timeout)
        }
    })
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = waitForSelector
}
export const processedMessages = new Set();
export function addProcessed(id) {
    processedMessages.add(id);
    if (processedMessages.size > 1000) {
        const primeiro = processedMessages.values().next().value;
        processedMessages.delete(primeiro);
    }
}
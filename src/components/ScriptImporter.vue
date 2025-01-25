<script setup>
import { ref } from 'vue'
import { chatWithAI } from '../api/chat'

const fileContent = ref('')
const response = ref('')
const isProcessing = ref(false)
const userInput = ref('')

// ... 其他代码保持不变 ...

const processScript = async () => {
    if (!fileContent.value) return

    isProcessing.value = true
    try {
        const result = await chatWithAI('开始对话', fileContent.value)
        response.value = result
    } catch (error) {
        console.error('处理失败:', error)
        alert('处理失败，请重试')
    } finally {
        isProcessing.value = false
    }
}

const sendResponse = async () => {
    if (!userInput.value.trim()) return

    isProcessing.value = true
    try {
        const result = await chatWithAI(userInput.value, fileContent.value)
        response.value += '\n\n你：' + userInput.value + '\n\n' + result
        userInput.value = ''
    } catch (error) {
        console.error('发送失败:', error)
        alert('发送失败，请重试')
    } finally {
        isProcessing.value = false
    }
}
</script>
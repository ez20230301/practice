<template>
    <div class="dialogue-container">
        <div class="chat-history" ref="chatContainer">
            <div v-for="(message, index) in chatHistory" :key="index" class="message">
                {{ message.content }}
            </div>
        </div>

        <div class="input-area">
            <button @click="nextLine" :disabled="isLoading" class="next-button">
                {{ isLoading ? '加载中...' : '下一句(空格)' }}
            </button>
            <button @click="restartDialogue" :disabled="isLoading" class="restart-button">
                重新开始
            </button>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { initializeChat, chatWithAI } from '../api/chat'

const chatHistory = ref([])
const isLoading = ref(false)
const error = ref('')
const chatContainer = ref(null)

// 添加键盘事件处理
const handleKeyPress = (event) => {
    if (event.code === 'Space' && !isLoading.value) {
        event.preventDefault() // 防止空格键滚动页面
        nextLine()
    }
}

// 修改滚动函数，增加底部留白
const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        const extraSpace = 200 // 底部留白空间（像素）
        chatContainer.value.scrollTo({
            top: chatContainer.value.scrollHeight - extraSpace,
            behavior: 'smooth'
        })
    }
}

// 监听聊天历史变化，自动滚动
watch(chatHistory, () => {
    scrollToBottom()
})

const startDialogue = async () => {
    try {
        isLoading.value = true
        error.value = ''
        const response = await initializeChat()
        chatHistory.value.push({
            role: 'assistant',
            content: response
        })

        // 确保在初始消息添加后滚动到底部
        await scrollToBottom()
    } catch (e) {
        error.value = '发生错误，请刷新页面重试'
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

const nextLine = async () => {
    if (isLoading.value) return

    try {
        isLoading.value = true
        error.value = ''

        const response = await chatWithAI('继续')

        chatHistory.value.push({
            role: 'assistant',
            content: response
        })

        // 确保在消息添加后滚动到底部
        await scrollToBottom()
    } catch (e) {
        error.value = '发生错误，请稍后重试'
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

const restartDialogue = async () => {
    if (isLoading.value) return

    chatHistory.value = []
    await startDialogue()
}

onMounted(() => {
    startDialogue()
    window.addEventListener('keydown', handleKeyPress)
})

// 清理事件监听
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.dialogue-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 70vh;
}

.chat-history {
    flex-grow: 1;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    background: #f9f9f9;
    padding-bottom: 100px;
    /* 增加底部内边距 */
}

.message {
    margin-bottom: 15px;
    padding: 10px;
    background: #fff;
    border-left: 4px solid #2196f3;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    white-space: pre-wrap;
    line-height: 1.5;
    color: #333;
    text-align: left;
    margin-right: 0;
    margin-left: 0;
}

.input-area {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px;
}

.next-button {
    padding: 12px 24px;
    background: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    min-width: 120px;
    transition: background-color 0.3s;
}

.next-button:hover {
    background: #1976d2;
}

.next-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.restart-button {
    padding: 12px 24px;
    background: #ff5722;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    min-width: 120px;
    transition: background-color 0.3s;
}

.restart-button:hover {
    background: #f4511e;
}

.restart-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.error-message {
    color: red;
    margin-top: 10px;
    text-align: center;
}
</style>
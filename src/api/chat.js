import axios from 'axios'
import scriptContent from '../assets/熬人奇妙夜2.0.txt?raw'

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

const apiClient = axios.create({
    baseURL: 'https://api.deepseek.com',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

let dialogueHistory = []

export const initializeChat = async () => {
    dialogueHistory = [
        {
            role: 'system',
            content: `你是一个按照剧本内容进行对戏的助手。
            
            规则：
            1. 严格按照剧本顺序进行对话
            2. 每次只返回一个角色的台词，格式为："角色名：台词内容"（例如"1龙：台词内容"）
            3. 等待用户回应后再显示下一个角色的台词, 不校验用户输入的台词
            4. 当轮到"司离谱"说台词时，只返回"轮到你说司离谱的台词..."
            5. 不要在返回内容中添加任何额外的说明文字
            6. 研发部的台词不需要用户输入 自动返回 如果发现下一句是研发部的台词，自动返回
            
            剧本内容：${scriptContent}`
        },
        {
            role: 'user',
            content: '开始对话'
        }
    ]

    const response = await apiClient.post('/v1/chat/completions', {
        model: 'deepseek-chat',
        messages: dialogueHistory
    })

    const message = response.data.choices[0].message
    dialogueHistory.push(message)
    return message.content
}

export const chatWithAI = async (userMessage) => {
    try {
        dialogueHistory.push({
            role: 'user',
            content: userMessage
        })

        const response = await apiClient.post('/v1/chat/completions', {
            model: 'deepseek-chat',
            messages: dialogueHistory
        })

        const message = response.data.choices[0].message
        dialogueHistory.push(message)
        return message.content
    } catch (error) {
        console.error('API调用错误:', error)
        throw error
    }
}
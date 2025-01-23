const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// 使用用户提供的API密钥
const DEEPSEEK_API_KEY = 'sk-8ef9f1245e6041ec9260dcc713f7c16f';

app.use(cors());
app.use(express.json());

// 搜索接口
app.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [{
                role: "user",
                content: query
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});

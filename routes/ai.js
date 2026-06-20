const express = require('express');
const router = express.Router();
const https = require('https');
const AiPoster = require('../models/AiPoster');

router.post('/generate', async (req, res) => {
  try {
    const { prompt, type, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured in backend.' });
    }

    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let categoryContext = '';
    if (type === 'festival') {
      categoryContext = `This is a Festival Poster for the festival "${context || prompt}". Generate high-quality festive greetings.`;
    } else if (type === 'business') {
      categoryContext = `This is a Business Advertisement Poster for the business/offer "${prompt}". Generate high-contrast, catchy promotional headlines.`;
    } else if (type === 'politics') {
      categoryContext = `This is a Political Campaign Poster/Banner for candidate/topic "${prompt}". Generate motivating, patriotic campaign slogans.`;
    }

    const instructions = `
      You are an expert copywriter and graphic designer.
      Generate a catchy poster content based on: "${prompt}".
      ${categoryContext}
      
      You must respond with a JSON object that matches this schema:
      {
        "headline": "A short bold title or slogan (max 5-6 words)",
        "subheadline": "A descriptive tagline or details about the event/offer (max 15 words)",
        "cta": "A short call to action (e.g. Call Now, Shop Sale, Jai Hind, Happy Pongal, etc.)",
        "bgColor": "A beautiful premium background hex color (e.g. #0F172A)",
        "textColor": "A matching readable text hex color (e.g. #F8FAFC)",
        "accentColor": "An accent hex color for details or highlights (e.g. #00F2FE)"
      }
      
      Respond with ONLY the JSON object. Do not include markdown codeblocks or extra text.
    `;

    const requestData = JSON.stringify({
      contents: [
        {
          parts: [
            { text: instructions }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const apiReq = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
      }
    }, (apiRes) => {
      let responseData = '';
      apiRes.on('data', (chunk) => {
        responseData += chunk;
      });
      apiRes.on('end', () => {
        if (apiRes.statusCode === 200) {
          try {
            const parsedData = JSON.parse(responseData);
            const textResponse = parsedData.candidates[0].content.parts[0].text;
            const parsedJson = JSON.parse(textResponse.trim());
            return res.json(parsedJson);
          } catch (parseError) {
            console.error('Failed to parse Gemini response:', responseData);
            return res.status(500).json({ error: 'Failed to generate valid structured content.' });
          }
        } else {
          console.error(`Gemini API Error: Status ${apiRes.statusCode}`, responseData);
          return res.status(apiRes.statusCode).json({ error: 'Gemini API call failed.' });
        }
      });
    });

    apiReq.on('error', (error) => {
      console.error('Request Error:', error);
      res.status(500).json({ error: 'Failed to connect to AI service.' });
    });

    apiReq.write(requestData);
    apiReq.end();

  } catch (error) {
    console.error('AI generation route error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const model = 'imagen-4.0-fast-generate-001';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;

    const requestData = JSON.stringify({
      instances: [
        {
          prompt: prompt
        }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1'
      }
    });

    const apiReq = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    }, (apiRes) => {
      let responseData = '';
      apiRes.on('data', (chunk) => {
        responseData += chunk;
      });
      apiRes.on('end', async () => {
        if (apiRes.statusCode === 200) {
          try {
            const parsedData = JSON.parse(responseData);
            
            if (!parsedData.predictions || parsedData.predictions.length === 0 || !parsedData.predictions[0].bytesBase64Encoded) {
              console.error('No predictions in response:', responseData);
              return res.status(500).json({ error: 'Failed to generate image bytes.' });
            }
            
            const base64Image = parsedData.predictions[0].bytesBase64Encoded;

            // Now, upload this base64 image directly to ImageKit from the backend!
            const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
            if (!ikPrivateKey) {
              return res.status(500).json({ error: 'ImageKit private key not configured.' });
            }

            const authHeader = 'Basic ' + Buffer.from(ikPrivateKey + ':').toString('base64');
            const ikUploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';

                        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
            let ikRequestBody = '';
            ikRequestBody += `--${boundary}\r\n`;
            ikRequestBody += `Content-Disposition: form-data; name="file"\r\n\r\n`;
            ikRequestBody += `data:image/png;base64,${base64Image}\r\n`;
            ikRequestBody += `--${boundary}\r\n`;
            ikRequestBody += `Content-Disposition: form-data; name="fileName"\r\n\r\n`;
            ikRequestBody += `ai_poster_${Date.now()}.png\r\n`;
            ikRequestBody += `--${boundary}--\r\n`;

            const ikReq = https.request(ikUploadUrl, {
              method: 'POST',
              headers: {
                'Authorization': authHeader,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(ikRequestBody)
              }
            }, (ikRes) => {
              let ikResponseData = '';
              ikRes.on('data', (chunk) => {
                ikResponseData += chunk;
              });
              ikRes.on('end', async () => {
                if (ikRes.statusCode === 200) {
                  try {
                    const ikResult = JSON.parse(ikResponseData);

                    // ✅ Save to MongoDB
                    try {
                      await AiPoster.create({
                        prompt: prompt,
                        imageUrl: ikResult.url,
                        ikFileId: ikResult.fileId || '',
                        ikFileName: ikResult.name || '',
                        model: model,
                      });
                      console.log('AI Poster saved to DB:', ikResult.url);
                    } catch (dbErr) {
                      console.error('Failed to save AI poster to DB:', dbErr.message);
                      // Don't block response if DB save fails
                    }

                    return res.json({ url: ikResult.url, fileId: ikResult.fileId });
                  } catch (ikParseError) {
                    console.error('Failed to parse ImageKit response:', ikResponseData);
                    return res.status(500).json({ error: 'Failed to upload generated image to ImageKit.' });
                  }
                } else {
                  console.error(`ImageKit API error: Status ${ikRes.statusCode}`, ikResponseData);
                  return res.status(ikRes.statusCode).json({ error: 'ImageKit upload failed.' });
                }
              });
            });

            ikReq.on('error', (err) => {
              console.error('ImageKit Request Error:', err);
              return res.status(500).json({ error: 'ImageKit connection failed.' });
            });

            ikReq.write(ikRequestBody);
            ikReq.end();

          } catch (parseError) {
            console.error('Failed to parse Gemini response:', responseData);
            return res.status(500).json({ error: 'Failed to generate valid image content.' });
          }
        } else {
          console.error(`Gemini Image API Error: Status ${apiRes.statusCode}`, responseData);
          return res.status(apiRes.statusCode).json({ error: 'Gemini Image API call failed.' });
        }
      });
    });

    apiReq.on('error', (error) => {
      console.error('Request Error:', error);
      res.status(500).json({ error: 'Failed to connect to AI image service.' });
    });

    apiReq.write(requestData);
    apiReq.end();

  } catch (error) {
    console.error('AI Image generation route error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/ai/history — Fetch all AI generated posters from DB
router.get('/history', async (req, res) => {
  try {
    const posters = await AiPoster.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ posters });
  } catch (error) {
    console.error('Failed to fetch AI poster history:', error);
    return res.status(500).json({ error: 'Failed to fetch history.' });
  }
});

module.exports = router;

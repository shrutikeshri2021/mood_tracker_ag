export class VoiceEmotionEngine {
  analyzeText(transcript) {
    if (!transcript) return [];
    
    const text = transcript.toLowerCase();
    
    const dictionary = {
      'anger': ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated'],
      'sadness': ['sad', 'lonely', 'crying', 'empty', 'depressed', 'grief', 'hurt'],
      'burnout': ['overwhelmed', 'too much', 'stress', 'deadline', 'exhausted', 'tired', 'drained', 'burnt out'],
      'joy': ['happy', 'proud', 'amazing', 'good', 'great', 'excited', 'win', 'love', 'grateful'],
      'anxiety': ['anxious', 'nervous', 'scared', 'worried', 'panic', 'fear', 'dread']
    };

    const finalTags = new Set();
    
    Object.keys(dictionary).forEach(emotion => {
       dictionary[emotion].forEach(keyword => {
           if (text.includes(keyword)) {
               finalTags.add(`#${emotion}`);
               // Optionally surface the specific trigger tag safely
               if (keyword === 'deadline' || keyword === 'too much') {
                 finalTags.add(`#${keyword.replace(' ', '')}`);
               }
           }
       });
    });

    return Array.from(finalTags);
  }
}

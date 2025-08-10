document.addEventListener('alpine:init', () => {
  Alpine.data('kimonoEnglishAssistant', () => ({
    conversation: {},
    buttons: [
      { key: 'arrival', label: '玄関' },
      { key: 'kimono_selection', label: '着物選び' },
      { key: 'dressing', label: '着付け' },
      { key: 'hairstyle', label: 'ヘアセット' },
      { key: 'before_going_out', label: '送り出し' },
      { key: 'payment', label: 'お会計' },
      { key: 'returning', label: 'お戻り' },
    ],
    selectedKey: 'arrival',
    currentCategoryConversation: [],
    selectedPhrase: null,
    englishVoice: null,

    async init() {
      const response = await fetch('conversation.json');
      this.conversation = await response.json();
      this.setCategory(this.selectedKey);
      this.setEnglishVoice();
      speechSynthesis.onvoiceschanged = () => this.setEnglishVoice();
    },

    setCategory(key) {
      this.selectedKey = key;
      this.currentCategoryConversation = this.conversation[key];
      this.selectedPhrase = null;
    },

    showPhrase(phrase) {
      this.selectedPhrase = phrase;
      this.speakText(phrase.en);
    },

    setEnglishVoice() {
      const voices = speechSynthesis.getVoices();
      this.englishVoice =
        voices.find(v => /karen|samantha/i.test(v.name)) ||
        voices.find(v => /google .* english female/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith('en') && /female|woman/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith('en'));
    },

    speakText(text) {
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = this.englishVoice;
      utter.lang = 'en-US';
      utter.pitch = 1.2;
      speechSynthesis.speak(utter);
    }

  }))
})
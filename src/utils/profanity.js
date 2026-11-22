import filter from 'leo-profanity';

filter.add(filter.getDictionary('ru'));

const cleanText = (text) => filter.clean(text);

export default cleanText;

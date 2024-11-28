function isLengthValidated(word, min_char, max_char) {
  if (word.length < min_char || word.length > max_char) {
    return false;
  } else {
    return true;
  }
}

export default isLengthValidated;
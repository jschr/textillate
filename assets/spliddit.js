// Attribution https://github.com/essdot/spliddit

var HIGH_SURROGATE_START = 0xD800
var HIGH_SURROGATE_END = 0xDBFF

var LOW_SURROGATE_START = 0xDC00

var REGIONAL_INDICATOR_START = 0x1F1E6
var REGIONAL_INDICATOR_END = 0x1F1FF

var FITZPATRICK_MODIFIER_START = 0x1f3fb
var FITZPATRICK_MODIFIER_END = 0x1f3ff

function spliddit (s, delimiter) {
  if (s === void 0 || s === null) {
    throw new Error('s cannot be undefined or null')
  }

  if (Array.isArray(s)) {
    s = s.join('')
  }

  if (delimiter instanceof RegExp ||
    (typeof delimiter === 'string' && delimiter.length)
  ) {
    return s.split(delimiter)
  }

  return split_into_chars(s)
}

function split_into_chars (s) {
  var i = 0
  var increment
  var result = []

  while (i < s.length) {
    increment = take_how_many(i, s)
    result.push(s.substring(i, i + increment))
    i += increment
  }

  return result
}

// Decide how many code units make up the current character.
// BMP characters: 1 code unit
// Non-BMP characters (represented by surrogate pairs): 2 code units
// Emoji with skin-tone modifiers: 4 code units (2 code points)
// Country flags: 4 code units (2 code points)
function take_how_many (i, s) {
  var last_index = s.length - 1
  var current = s[i]
  var current_pair
  var next_pair

  // If we don't have a value that is part of a surrogate pair, or we're at
  // the end, only take the value at i
  if (!is_first_of_surrogate_pair(current) || i === last_index) {
    return 1
  }

  // If the array isn't long enough to take another pair after this one, we
  // can only take the current pair
  if ((i + 3) > last_index) {
    return 2
  }

  current_pair = current + s[i + 1]
  next_pair = s.substring(i + 2, i + 5)

  // Country flags are comprised of two regional indicator symbols,
  // each represented by a surrogate pair.
  // See http://emojipedia.org/flags/
  // If both pairs are regional indicator symbols, take 4
  if (is_regional_indicator_symbol(current_pair) &&
    is_regional_indicator_symbol(next_pair)) {
    return 4
  }

  // If the next pair make a Fitzpatrick skin tone
  // modifier, take 4
  // See http://emojipedia.org/modifiers/
  // Technically, only some code points are meant to be
  // combined with the skin tone modifiers. This function
  // does not check the current pair to see if it is
  // one of them.
  if (is_fitzpatrick_modifier(next_pair)) {
    return 4
  }

  return 2
}

function is_first_of_surrogate_pair (c) {
  if (c === void 0 || c === null || !c.hasOwnProperty(0)) {
    return false
  }

  return between_inclusive(
    c[0].charCodeAt(0), HIGH_SURROGATE_START, HIGH_SURROGATE_END
  )
}

function has_pair (s) {
  if (typeof s !== 'string') {
    return false
  }

  return s.split('').some(is_first_of_surrogate_pair)
}

function is_regional_indicator_symbol (s) {
  var code_point = code_point_from_surrogate_pair(s)

  return between_inclusive(
    code_point, REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END
  )
}

function is_fitzpatrick_modifier (s) {
  var code_point = code_point_from_surrogate_pair(s)

  return between_inclusive(
    code_point, FITZPATRICK_MODIFIER_START, FITZPATRICK_MODIFIER_END
  )
}

// Turn two code units (surrogate pair) into
// the code point they represent.
function code_point_from_surrogate_pair (s) {
  var high_offset = s.charCodeAt(0) - HIGH_SURROGATE_START
  var low_offset = s.charCodeAt(1) - LOW_SURROGATE_START

  return (high_offset << 10) + low_offset + 0x10000
}

function between_inclusive (value, lower_bound, upper_bound) {
  return value >= lower_bound && value <= upper_bound
}

module.exports = spliddit
module.exports.isFirstOfPair = is_first_of_surrogate_pair
module.exports.hasPair = has_pair
// URL validation regex - matches SwiftUI implementation
const URL_REGEX = /((?:http|https):\/\/)?(?:www\.)?[\w\d\-_]+\.\w{2,3}(\.\w{2})?(\/(?<=\/)(?:[\w\d\-./_]+)?)?/;

export function isValidURL(text: string): boolean {
  return URL_REGEX.test(text);
}

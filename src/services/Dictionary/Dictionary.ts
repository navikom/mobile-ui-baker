import moment from "moment";
import {settings} from './settings';
import AbstractDictionary from "services/Dictionary/AbstractDictionary";

type EN = typeof settings.en;
type EN_TYPE = keyof typeof settings.en;

const locales = {
  en: "en-US"
};

export class DictionaryService extends AbstractDictionary {
  locale: string;
  static keys: EN = settings.en;

  get moment() {
    return moment;
  }

  timeDateString(date?: Date) {
    if(!date) return null;
    return moment(date).format("lll");
  }

  dateString(date?: Date) {
    if(!date) return null;
    return moment(date).format("YYYY-MM-DD");
  }

  constructor(locale: "en") {
    super(settings[locale], {});
    this.locale = locales[locale];
    this.data = settings[locale];

    let key: EN_TYPE;
    for(key in DictionaryService.keys) {
      this.reversed[DictionaryService.keys[key]] = key;
    }
  }
}

export const Dictionary = new DictionaryService("en");

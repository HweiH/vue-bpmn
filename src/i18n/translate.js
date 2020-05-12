/**
 * Created by hasee on 2020/5/9.
 */
import translations from './translations';

export default function customTranslate(template, replacements) {
    replacements = replacements || {};

    // Translate
    template = translations[template] || template;

    // Replace
    return template.replace(/{([^}]+)}/g, function(_, key) {
        //return replacements[key] || '{' + key + '}';
        var str = replacements[key];
        if(translations[replacements[key]] != null && translations [replacements[key]] != 'undefined'){
            str = translations[replacements[key]];
        }
        return  str || '{' + key + '}';
    });
}
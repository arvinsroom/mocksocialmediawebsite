import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';

const selectAllGlobalLanguages = state => state.global.languages;
const selectActiveLan = state => state.global.active;
const selectDefaultLan = state => state.global.default;
const selectActiveId = (state, id) => id;


export const selectActiveLanguage = createSelector(
  [selectAllGlobalLanguages, selectActiveLan, selectDefaultLan],
  (languages, activeLan, defaultLan) => {
    console.log('expensive operations');
    if (!defaultLan && !activeLan) return null;
    if (!activeLan && defaultLan) return languages[defaultLan].translations;
    // here merge the two objects, we know they will have same keys
    let newLan = { ...languages[activeLan].translations };
    for (const [key, value] of Object.entries(newLan)) {
      if (!value) newLan[key] = languages[defaultLan].translations[key];
    }
    return newLan;
  }
);

// export const selectActiveLanguage = createCachedSelector(
//   [selectAllGlobalLanguages, selectActiveId],
//   (languages, activeId) => {
//     // very first time
//     console.log('expensive operations');
//     if (activeId === null) return languages[defaultLan].translations;

//     if (!defaultLan && !activeLan) return null;
//     if (!activeLan && defaultLan) 
//     // here merge the two objects, we know they will have same keys
//     let newLan = { ...languages[activeLan].translations };
//     for (const [key, value] of Object.entries(newLan)) {
//       if (!value) newLan[key] = languages[defaultLan].translations[key];
//     }
//     return newLan;
//   }
// ) (
//   (state, id) => id
// );

export const selectAllLanguage = createSelector(
  [selectAllGlobalLanguages],
  (languages) => {
    let menuSelector = [];
    Object.keys(languages).map(key => menuSelector.push({ name: languages[key].name, _id: key }));
    return menuSelector;
  }
);


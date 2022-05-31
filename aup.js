"use strict";

// Demande le lancement de l'exécution quand toute la page Web sera chargée
window.addEventListener('load', go);

// SAM Design Pattern : http://sam.js.org/
let actions, model, state, view;

//-------------------------------------------------------------------- Init ---
// Point d'entrée de l'application
function go() {
    console.log('GO !');

    sandbox();

    const data = {
        authors: 'Thierno Mamadou Mouctar Bah et Prénom2 NOM2',
        languagesSrc: ['fr', 'en', 'es'],
        languagesDst: ['fr', 'en', 'es', 'it', 'ar', 'eo', 'ja', 'zh'],
        langSrc: 'fr',
        langDst: 'en',
        translations: translations1,
    };
    actions.initAndGo(data);
}

//-------------------------------------------------------------------- Tests ---

function sandbox() {

    function action_display(data) {
        // console.log(data);
        if (!data.error) {
            const language = languages[data.languageDst].toLowerCase();
            console.log(`'${data.expression}' s'écrit '${data.translatedExpr}' en ${language}`);
        } else {
            console.log('Service de traduction indisponible...');
        }
    }

    const expr = 'asperge';
    const langSrc = 'fr';
    const langDst = 'en';
    googleTranslation(expr, langSrc, langDst, action_display);
}

//------------------------------------------------------------------ Données ---

// Correspondance entre codes de langue et leur nom
// Pour d'autres langues, voir ici :  https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1
const languages = {
    fr: 'Français',
    en: 'Anglais',
    es: 'Espagnol',
    it: 'Italien',
    ar: 'Arabe',
    eo: 'Espéranto',
    ja: 'Japonais',
    zh: 'Chinois',
};

//------------------------------------------------------------------ Actions ---
// Actions appelées dans le code HTML quand des événements surviennent
//
actions = {
    changeTab(data) {
        model.samPresent({
            do: 'changeTab',
            lang: data.lang
        })

    },
    about() {
        model.samPresent({
            do: 'about',
            traducteur: 'application web',
            auteur: 'Bah Thierno'
        })
    },

    change() {
        let tabSelectFrom = []
        let tabSelecto = []
        let selectTo = document.getElementById('selectTo'); //langue de traduction
        for (let i = 0; i < selectTo.length; i++) {
            tabSelecto.push(selectTo[i].value);
        }
        let selectFrom = document.getElementById('selectFroms');

        for (let i = 0; i < selectFrom.length; i++) {
            tabSelectFrom.push(selectFrom[i].value);
        }

        for (let i = 0; i < tabSelectFrom.length; i++) {
            if (selectTo[selectTo.selectedIndex].value === tabSelectFrom[i]) {
                let indexselectFrom = selectFrom.selectedIndex;
                let indexselecto = selectTo.selectedIndex;
                if (selectTo[selectTo.selectedIndex].value !== selectFrom[selectFrom.selectedIndex].value) {
                    console.log(indexselectFrom + '----' + indexselecto);
                    selectTo[indexselectFrom].selected = true
                    selectFrom[indexselecto].selected = true
                    break;
                }
            }
        }


    },

    traduire() {
        let expressionText = document.getElementById('expressionText').value; //text  a traduire

        let selectTo = document.getElementById('selectTo'); //langue de traduction
        selectTo = selectTo[selectTo.selectedIndex].value;
        // console.log(expressionText);

        let selectFrom = document.getElementById('selectFroms');
        selectFrom = selectFrom[selectFrom.selectedIndex].value;

        function action_display(data) {
            // console.log(data);
            if (!data.error) {
                const language = languages[data.languageDst].toLowerCase();
                console.log(`'${data.expression}' s'écrit '${data.translatedExpr}' en ${language}`);
                model.samPresent({
                    do: 'traduire',
                    langSrc: selectFrom,
                    langDst: selectTo,
                    expression: expressionText,
                    traduit: data.translatedExpr,

                })
            } else {
                console.log('Service de traduction indisponible...');
            }
        }
        if (expressionText !== "") {
            googleTranslation(expressionText, selectFrom, selectTo, action_display);
        } else {
            alert('vide!')
        }

    },
    initAndGo(data) {
        model.samPresent({
            do: 'init',
            authors: data.authors,
            langSrc: data.langSrc,
            langDst: data.langDst,
            languagesSrc: data.languagesSrc,
            languagesDst: data.languagesDst,
            translations: data.translations,
        });
    },

    // TODO: Ajouter les autres actions...
};

//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {
    tabs: {
        fr: ["fr", 3],
        en: ["en", 2],
        es: ["es", 1],
        it: ["it", 1],
        ar: ["ar", 1],
        eo: ["eo", 0],
        ja: ["ja", 0],
        zh: ["zh", 0],
    },

    // TODO: propriétés pour les onglets
    request: {
        languagesSrc: [],
        languagesDst: [],
        langSrc: '',
        langDst: '',
        expression: '',
    },
    translations: {
        values: [
            // ['fr','Asperge','en','Asparagus'],
        ],
    },
    sorted: {
        // TODO: propriétés pour trier les colonnes
    },
    marked: {
        // TODO: propriétés pour les lignes marquées pour suppression
    },
    pagination: {
        // TODO: propriétés pour gérer la pagination
    },
    app: {
        authors: '',
        mode: 'main', // in ['main', 'lang']
        sectionId: 'app',
    },

    // Demande au modèle de se mettre à jour en fonction des données qu'on
    // lui présente.
    // l'argument data est un objet confectionné dans les actions.
    // Les propriétés de data comportent les modifications à faire sur le modèle.
    samPresent(data) {

        switch (data.do) {

            case 'init':
                this.app.authors = data.authors;
                this.request.languagesSrc = data.languagesSrc;
                this.request.languagesDst = data.languagesDst;
                this.request.langSrc = data.langSrc;
                this.request.langDst = data.langDst;
                this.translations.values = data.translations;
                break;


            case 'traduire': // TODO: Autres modifications de model...
                let tab = [];
                let tabSelect1 = [];
                tab.push(data.langSrc, data.expression, data.langDst, data.traduit);
                this.request.languagesSrc.push(data.langSrc);
                this.request.languagesDst.push(data.langDst);
                this.request.langSrc = data.langSrc;
                this.request.langDst = data.langDst;
                this.translations.values.push(tab);
                this.tabs[data.langSrc][1] += 1;
                this.tabs[data.langDst][1] += 1;

                // if (this.tabs.tabLangage.length > 0) {

                // } else {
                //     alert('vide');
                // }
                // if (data.langSrc in this.tabs.tabLangage) {
                //     alert("il existe");
                // } else {
                //     this.tabs.tabLangage.push([data.langDst, 1]);
                //     // alert("il n'existe pas");
                // }
                // console.log(this.tabs[data.langSrc][1]);

                // console.log(this.request.languagesSrc + "\n" + this.request.languagesDst + "\n" + this.request.langSrc + "\n" + this.request.langDst + "\n");
                // console.log(this.translations.values);
                break;

            case 'changeTab':
                let tabSelect = [];
                // tabSelect = this.translations.values.map((v, i, a) => v[0]).concat(this.translations.values.map((v, i, a) => v[2]));
                // tabSelect = tabSelect.filter((v, i, a) => (v.includes(data.lang)));
                // this.tabs.tabchange = tabSelect;
                // console.log(this.tabs.tabchange);
                // console.log(this.translations.values.map((v, i, a) => v[0]).concat(this.translations.values.map((v, i, a) => v[2])).filter((v, i, a) => (v.includes('fr'))));
                // console.log(this.translations.values.map((v, i, a) => v[0]) + this.translations.values.map((v, i, a) => v[2]));
                break
            case 'about':
                break;
            default:
                console.error(`model.samPresent(), unknown do: '${data.do}' `);
        }

        // Demande à l'état de l'application de prendre en compte la modification
        // du modèle
        state.samUpdate(this);
    },
};
//-------------------------------------------------------------------- State ---
// État de l'application avant affichage
//
state = {
    tabs: {
        // TODO: données des onglets déduites de model
    },
    translations: {
        // TODO: données de traductions déduites de model (par langue notamment)
        tabLangages: [],
    },

    samUpdate(model) {

        // TODO: Toutes les mises à jour des données pour préparer l'affichage

        this.samRepresent(model);
    },

    // Met à jour l'état de l'application, construit le code HTML correspondant,
    // et demande son affichage.
    samRepresent(model) {
        let representation = '';

        let headerUI = view.headerUI(model, state);
        let tabsUI = view.tabsUI(model, state);
        let requestsUI = view.requestsUI(model, state);
        let traductionUI = view.traductionUI(model, state);
        representation += headerUI;
        representation += tabsUI;
        representation += requestsUI;
        representation += traductionUI;
        this.tabs = this.tabOnglet(model.tabs);
        this.translations.tabLangages.push(this.tabTranslation(model.translations.values));
        // TODO: la représentation de l'interface est différente selon
        //       qu'on affiche l'onglet 'Traductions' (avec formulaire de traduction)
        //       ou qu'on affiche les onglets par langue...

        representation = view.generateUI(model, this, representation);

        view.samDisplay(model.app.sectionId, representation);
    },

    //------------------------------------------fonctions ajouter par moi-----------------------------------------
    tabOnglet: (tabs) => {
        let tabOnglet = [];
        // console.log("t'es dans le bo chemin si tu me vois", tabs);
        tabs = Object.values(tabs);
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i][1] > 0) {
                tabOnglet.push([tabs[i][0], tabs[i][1]]);
            }
        }
        // console.log(tabOnglet);
        return tabOnglet;
    },

    tabTranslation: (tabTranslation) => {
        let tab = [];
        console.log("t'es dans le bo chemin si tu me vois", state.translations.tabLangages);
        for (let i = 0; i < tabTranslation.length; i++) {
            if (tab.length <= 0) {
                tab.push([
                    tabTranslation[i][0],
                    [{
                        depuisLangSelect: [tabTranslation[i][1]],
                        verOthr: [tabTranslation[i][3]]
                    }],
                    [{
                        depuisOther: [],
                        versLangSelect: []
                    }],
                ])

                tab.push([
                    tabTranslation[i][2],
                    [{
                        depuisLangSelect: [],
                        verOthr: []
                    }],
                    [{
                        depuisOther: [tabTranslation[i][3]],
                        versLangSelect: [tabTranslation[i][1]]
                    }],
                ])
            } else {
                let exist1 = false;
                let exist = false;
                let index;
                for (let j = 0; j < tab.length; j++) {
                    if (tab[j][0] === tabTranslation[i][0]) {
                        alert(tab[j][0] + " compare " + tabTranslation[i][0])
                        index = tab.indexOf(tab[j]);
                        exist = true;
                        break;
                    }

                }
                if (!exist) {
                    tab.push([
                        tabTranslation[i][0],
                        [{
                            depuisLangSelect: [tabTranslation[i][1]],
                            verOthr: [tabTranslation[i][3]]
                        }],
                        [{
                            depuisOther: [],
                            versLangSelect: []
                        }],
                    ])
                } else {
                    tab[index][1][0]['depuisLangSelect'].push([tabTranslation[i][1]])
                    tab[index][1][0]['verOthr'].push([tabTranslation[i][3]])
                }
                //******************************************************************** */
                for (let j = 0; j < tab.length; j++) {
                    if (tab[j][0] === tabTranslation[i][2]) {
                        index = tab.indexOf(tab[j]);
                        exist1 = true;
                        break;
                    }

                }
                if (!exist1) {
                    tab.push([
                        tabTranslation[i][2],
                        [{
                            depuisLangSelect: [tabTranslation[i][1]],
                            verOthr: [tabTranslation[i][3]]
                        }],
                        [{
                            depuisOther: [],
                            versLangSelect: []
                        }],
                    ])
                } else {
                    tab[index][2][0]['depuisOther'].push([tabTranslation[i][1]])
                    tab[index][2][0]['versLangSelect'].push([tabTranslation[i][3]])

                }
            }
        }
        console.log(tab, "==========");
        console.log("_______+++++_______", tabTranslation[0]);
        return tab;
    }




    // ____________________________________________________________________________________________________________
};
//--------------------------------------------------------------------- View ---
// Génération de portions en HTML et affichage
//
view = {

    // Injecte le HTML dans une balise de la page Web.
    samDisplay(eltId, representation) {
        const elt = document.getElementById(eltId);
        elt.innerHTML = representation;
    },

    // Renvoit le HTML
    generateUI(model, state, representation) {
        return `
    <div class="container">
      ${representation}
    </div>
    `;
    },
    //_____________________________ le header de la page__________________
    headerUI(model, state) {
        return `
      <section id="header" class="mt-4">
        <div class="row mb-4">
          <div class="col-6">
            <h1>Traducteur</h1>
          </div>
          <div class="col-6 text-right align-middle">
            <div class="btn-group mt-2">
              <button class="btn btn-primary">Charger</button>
              <button class="btn btn-ternary">Enregistrer</button>
              <button class="btn btn-secondary">Préférences</button>
              <button class="btn btn-primary" onclick="actions.about()">À propos</button>
            </div>
          </div>
        </div>
      </section>
    `;
    },
    //_________________Autre langue________________________________________
    tabsUI(model, state) {
        let listOnglet = this.listOnglet(model, state);
        return `
      <section id="tabs">
        <div class="row justify-content-start ml-1 mr-1">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Traductions
                      <span class="badge badge-primary">4</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="#"  onclick="actions.changeTab({lang: 'fr'})">Français
                      <span class="badge badge-primary">3</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="#">Anglais
                      <span class="badge badge-primary">2</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="#">Arabe
                      <span class="badge badge-primary">1</span>
                    </a>
                </li>
                <li class="nav-item">
                    <select class="custom-select" id="selectFrom">
                      <option selected="selected" value="0">Autre langue...</option>
                      <option value="es">Espagnol (1)</option>
                      <option value="it">Italien (1)</option>
                    </select>
                </li>
            </ul>
        </div>
      </section>
      <br />
      
      `
    },
    //______________le mot a traduire et les langues___________________________
    requestsUI(model, state) {
        return `
      <section id="request">
        <form action="">
            <div class="form-group">
                <fieldset class="form-group">
                  <div class="row align-items-end">
                      <div class="col-sm-3 col-5">
                          <div class="form-group">
                              <label for="selectFroms">Depuis</label>
                              <select class="custom-select" id="selectFroms">
                                <option selected="selected" value="fr">Français</option>
                                <option value="en">Anglais</option>
                                <option value="es">Espagnol</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group col-sm-1 col-2">
                            <button class="btn btn-secondary" type="button" onclick="actions.change()">⇄</button>
                          </div>
                          <div class="col-sm-3 col-5">
                            <div class="form-group">
                              <label for="selectTo">Vers</label>
                              <select class="custom-select" id="selectTo">
                                <option value="fr">Français</option>
                                <option selected="selected" value="en">Anglais</option>
                                <option value="es">Espagnol</option>
                                <option value="it">Italien</option>
                                <option value="ar">Arabe</option>
                                <option value="eo">Espéranto</option>
                                <option value="ja">Japonais</option>
                                <option value="zh">Chinois</option>
                              </select>
                            </div>
                          </div>
                          <div class="col-sm-5 col-12">
                            <div class="input-group mb-3">
                              <input value="" id="expressionText" type="text" class="form-control" placeholder="Expression..." />
                              <div class="input-group-append">
                                <button class="btn btn-primary" type="button" onclick="actions.traduire()">Traduire</button>
                              </div>
                            </div>
                          </div>
                      </div>
                </fieldset>
            </div>
        </form>
     </section>
      
      `
    },
    // le tableau d'affichages des mots traduts
    traductionUI(model, state) {
        let listTranslateDone = this.listTranslateDone(model, state);
        return `
        <section id="translations">
          <fieldset>
              <legend class="col-form-label">Traductions</legend>
              <div class="table-responsive">
                  <table class="col-12 table table-sm table-bordered">
                      <thead>
                          <th class="align-middle text-center col-1">
                              <a href="#">N°</a>
                          </th>
                          <th class="align-middle text-center col-1">
                              <a href="#">Depuis</a>
                          </th>
                          <th class="align-middle text-center ">
                              <a href="#">Expression</a>
                          </th>
                          <th class="align-middle text-center col-1">
                              <a href="#">Vers</a>
                          </th>
                          <th class="align-middle text-center ">
                              <a href="#">Traduction</a>
                          </th>
                          <th class="align-middle text-center col-1">
                              <div class="btn-group">
                                  <button class="btn btn-ternary">Suppr.</button>
                              </div>
                          </th>
                      </thead>
                      ${listTranslateDone}
                      <tr>
                          <td colspan="5" class="align-middle text-center"> </td>
                          <td class="align-middle text-center">
                              <div class="btn-group">
                                  <button class="btn btn-secondary">Suppr. tous</button>
                              </div>
                          </td>
                      </tr>
                  </table>
              </div>

              <section id="pagination">
                  <div class="row justify-content-center">

                      <nav class="col-auto">
                          <ul class="pagination">
                              <li class="page-item disabled">
                                  <a class="page-link" href="#" tabindex="-1">Précédent</a>
                              </li>
                              <li class="page-item active">
                                  <a class="page-link" href="#">1</a>
                              </li>
                              <li class="page-item disabled">
                                  <a class="page-link" href="#">Suivant</a>
                              </li>
                          </ul>
                      </nav>

                      <div class="col-auto">
                          <div class="input-group mb-3">
                              <select class="custom-select" id="selectTo">
                                <option value="3">3</option>
                                <option selected="selected" value="6">6</option>
                                <option value="9">9</option>
                              </select>
                              <div class="input-group-append">
                                  <span class="input-group-text">par page</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          </fieldset>
       </section>
      `
    },

    listTranslateDone(model, state) {
        // console.log(model.translations.values);
        let listTranslateDone = model.translations.values.map((v, i, a) => `
        <tr>
          <td class="text-center text-secondary"> ${i} </td>
          <td class="text-center">
              <span class="badge badge-info">${v[0]}</span>
          </td>
          <td>${v[1]}</td>
          <td class="text-center">
              <span class="badge badge-info">${v[2]}</span>
          </td>
          <td>${v[3]}</td>
          <td class="text-center">
              <div class="form-check">
                  <input type="checkbox" class="form-check-input" onchange="alert('ok')"/>
              </div>
          </td>
        </tr>`).join('\n');
        return listTranslateDone;
    },


    listOnglet(Model, state) {
        let listOnglet = state.tabs;
        // console.log('--------------------', listOnglet);
        return listOnglet;
    }


};
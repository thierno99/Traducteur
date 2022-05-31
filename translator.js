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
    changeNumberperpage(data) {
        model.samPresent({
            do: "changeNumberperpage",
            numberperpage: data.e.target.value,
        })
    },
    removeAll() {
        model.samPresent({
            do: "removeAll",
        })
    },
    remove() {
        model.samPresent({
            do: "remove",
        })
    },
    otherTab(data) {
        let lang = data.e.target.value;
        data.e.target.value = 0;
        // console.log(data.e.target.value);
        model.samPresent({
            do: 'changeTab',
            lang: lang
        })

    },
    changeTab(data) {
        model.samPresent({
            do: 'changeTab',
            lang: data.lang
        })

    },
    markRow(data) {
        if (model.marked.rowNum.indexOf(data.rowNum) == -1) {
            model.marked.rowNum.push(data.rowNum);
        } else {
            model.marked.rowNum = model.marked.rowNum.filter((v) => v !== data.rowNum)
        }
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
                } else {
                    model.changeblead = 'disabled="disabled"';
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
            if (!data.error) {
                alert('ok');
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
    changeblead: "",
    ongletActive: "traductions",
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
        rowNum: []
    },
    pagination: {
        // TODO: propriétés pour gérer la pagination
        numberperpage: 9,

    },
    app: {
        authors: '',
        mode: 'main', // in ['main', 'lang']
        sectionId: 'app',
    },
    activeTraduction: true,
    chageTab: [],

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
                tab.push(data.langSrc, data.expression, data.langDst, data.traduit);
                this.request.languagesSrc.push(data.langSrc);
                this.request.languagesDst.push(data.langDst);
                this.request.langSrc = data.langSrc;
                this.request.langDst = data.langDst;
                this.translations.values.push(tab);
                this.tabs[data.langSrc][1] += 1;
                this.tabs[data.langDst][1] += 1;

                // console.log(this.request.languagesSrc + "\n" + this.request.languagesDst + "\n" + this.request.langSrc + "\n" + this.request.langDst + "\n");
                // console.log(this.translations.values);
                break;

            case 'changeTab':
                let tabDepuis = [];
                let tabTranslation = this.translations.values;
                for (let i = 0; i < tabTranslation.length; i++) {
                    tabDepuis.push({
                        lang: tabTranslation[i][0],
                        translate: [tabTranslation[i][1], tabTranslation[i][3]],
                        vers: [tabTranslation[i][2]],
                        index: [i]
                    }, {
                        lang: tabTranslation[i][2],
                        translate: [tabTranslation[i][3], tabTranslation[i][1]],
                        vers: [tabTranslation[i][0]],
                        index: [i]
                    })
                }
                let tabOneLang = tabDepuis.filter((v) => (v['lang'].includes(data.lang)))
                if (data.lang !== 'traductions') {
                    this.ongletActive = languages[data.lang];
                    this.activeTraduction = false;
                } else {
                    this.ongletActive = "traductions";
                    this.activeTraduction = true;
                }
                this.chageTab = tabOneLang;
                // return tabDepuis;
                break
            case "remove":
                for (let i = 0; i < this.marked.rowNum.length; i++) {
                    this.translations.values = this.translations.values.filter((v, index) => index !== this.marked.rowNum[i]);
                }
                this.marked.rowNum = [];
                break;
            case "removeAll":
                let message = "";
                if (this.ongletActive === "traductions") {
                    message = "traductions"
                } else {
                    message = `traductions en ${this.ongletActive}`;
                }
                let confirmer = confirm(`êtes vous sur de vouloir supprimer \ntoutes les ${message} ?`);
                if (confirmer) {
                    if (this.ongletActive === "traductions") {
                        this.translations.values = [];
                        this.chageTab = [];
                    } else {
                        for (let i = 0; i < this.chageTab.length; i++) {
                            // console.log(this.chageTab[i]['index'][0], "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
                            this.translations.values = this.translations.values.filter((v, index) => index !== this.chageTab[i]['index'][0]);
                        }
                        this.chageTab = [];
                    }
                }
                break;
            case "changeNumberperpage":
                this.pagination.numberperpage = data.numberperpage;
                alert(this.pagination.numberperpage);
                break;
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
        tabsUIs: [
            ["fr", 3],
            ["en", 2],
            ["ar", 1],
            ["es", 1],
            ["it", 1],
            // ["traductions", 4],
        ]
    },
    translations: {
        // TODO: données de traductions déduites de model (par langue notamment)
        tabDepuis: [
            //     ["fr", "Asperge"],
            //     ["ar", "البرتقالي"],
            //     ["en", "Cauliflower"],
            //     ["it", "Pomodoro"]
            // ],
            // tabvers: [
            //     ["en", "Asparagus"],
            //     ["fr", "Orange"],
            //     ["fr", "Chou Fleur"],
            //     ["es", "Tomate"],
            //     ["en", "Hi"],
        ]
    },

    samUpdate(model) {

        // TODO: Toutes les mises à jour des données pour préparer l'affichage
        this.samRepresent(model);
    },

    // Met à jour l'état de l'application, construit le code HTML correspondant,
    // et demande son affichage.
    samRepresent(model) {
        let representation = '';
        let requestsUI = "";
        let headerUI = view.headerUI(model, state);
        let tabsUI = view.tabsUI(model, state);
        let traductionUI = view.traductionUI(model, state);
        representation += headerUI;
        representation += tabsUI;
        if (model.ongletActive == "traductions") {
            requestsUI = view.requestsUI(model, state);
            representation += requestsUI;
        } else {
            requestsUI = "";
        }
        representation += traductionUI;
        this.tabs.tabsUIs = this.tabOnglet(model.tabs);
        // TODO: la représentation de l'interface est différente selon
        //       qu'on affiche l'onglet 'Traductions' (avec formulaire de traduction)
        //       ou qu'on affiche les onglets par langue...

        representation = view.generateUI(model, this, representation);

        view.samDisplay(model.app.sectionId, representation);
    },

    //------------------------------------------fonctions ajouter par moi-----------------------------------------
    tabOnglet: (tabs) => {
        let tabsUIs = [];
        // console.log("t'es dans le bo chemin si tu me vois", tabs);
        tabs = Object.values(tabs);
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i][1] > 0) {
                tabsUIs.push([tabs[i][0], tabs[i][1]]);
            }
        }
        return tabsUIs;
    },
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
        let otherLangage = this.otherLangage(model, state);
        let activeTraduction = "";
        if (model.activeTraduction) {
            activeTraduction = "active";
            model.ongletActive = "traductions";
        } else {
            activeTraduction = "";
        }
        return `
      <section id="tabs">
        <div class="row justify-content-start ml-1 mr-1">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link ${activeTraduction}" href="#" onclick="actions.changeTab({lang: 'traductions'})">Traductions
                      <span class="badge badge-primary">${model.translations.values.length}</span>
                    </a>
                </li>
                ${listOnglet}
                <li class="nav-item">
                    <select class="custom-select" id="selectFrom" onchange="actions.otherTab({e: event})">
                      <option selected="selected" value="0">Autre langue...</option>
                      ${otherLangage}
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
        let classs = "btn btn-ternary";
        if (model.marked.rowNum.length <= 0) {
            classs = "btn btn-ternary";
        } else {
            classs = "btn btn-secondary";
        }
        let listPage = this.listPage(model, state);
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
                                  <button class="${classs}" onclick="actions.remove({})">Suppr.</button>
                              </div>
                          </th>
                      </thead>
                      ${listTranslateDone}
                      <tr>
                          <td colspan="5" class="align-middle text-center"> </td>
                          <td class="align-middle text-center">
                              <div class="btn-group">
                                  <button class="btn btn-secondary" onclick="actions.removeAll({})">Suppr. tous</button>
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
                              ${listPage}
                              <li class="page-item disabled">
                                  <a class="page-link" href="#">Suivant</a>
                              </li>
                          </ul>
                      </nav>

                      <div class="col-auto">
                          <div class="input-group mb-3">
                              <select class="custom-select" id="selectTo" onchange="actions.changeNumberperpage({e: event})">
                                <option value="3">3</option>
                                <option value="6">6</option>
                                <option selected="selected" value="9">9</option>
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
        if (model.ongletActive === "traductions") {
            let listTranslateDone = "";
            if (model.translations.values.length <= model.pagination.numberperpage) {
                listTranslateDone = model.translations.values.map((v, i, a) => `
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
                        <input type="checkbox" class="form-check-input" onchange="actions.markRow({rowNum: ${i}})"/>
                    </div>
                </td>
                </tr>`).join('\n');
                return listTranslateDone;
            } else {
                listTranslateDone = model.translations.values.filter((v, i) => i < model.pagination.numberperpage).map((v, i, a) => `
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
                        <input type="checkbox" class="form-check-input" onchange="actions.markRow({rowNum: ${i}})"/>
                    </div>
                </td>
                </tr>`).join('\n');
                return listTranslateDone;
            }
        } else {
            let listTranslateDone = model.chageTab;
            listTranslateDone = listTranslateDone.map((v, i, a) => `
            <tr>
            <td class="text-center text-secondary"> ${v['index'][0]} </td>
            <td class="text-center">
                <span class="badge badge-info">${v['lang']}</span>
            </td>
            <td>${v['translate'][0]}</td>
            <td class="text-center">
                <span class="badge badge-info">${v[ 'vers']}</span>
            </td>
            <td>${v['translate'][1]}</td>
            <td class="text-center">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" onchange="actions.markRow({rowNum: ${v['index'][0]}})"/>
                </div>
            </td>
            </tr>
            `).join("\n");
            return listTranslateDone;
        }
        // let listTranslateDone = state.translations.tabDepuis.map((v, i, a) => `
        // <tr>
        //   <td class="text-center text-secondary"> ${i} </td>
        //   <td class="text-center">
        //       <span class="badge badge-info">${v[0]}</span>
        //   </td>
        //   <td>${v[1]}</td>
        //   <td class="text-center">
        //       <span class="badge badge-info">${state.translations.tabvers[i][0]}</span>
        //   </td>
        //   <td>${state.translations.tabvers[i][1]}</td>
        //   <td class="text-center">
        //       <div class="form-check">
        //           <input type="checkbox" class="form-check-input" onchange="alert('ok')"/>
        //       </div>
        //   </td>
        // </tr>`).join('\n');
        // return listTranslateDone;
    },


    listOnglet(model, state) {
        let listOnglet = "";
        let active = "";
        if (model.ongletActive !== "traductions") {
            active = "active";
        } else {
            active = "";
        }
        if (state.tabs.tabsUIs.length > 0) {
            listOnglet += state.tabs.tabsUIs.slice(0, 1).map((v, i, a) => `
            <li class="nav-item">
                <a class="nav-link ${active}" href="#"  onclick="actions.changeTab({lang: '${v[0]}'})">${languages[v[0]]}
                <span class="badge badge-primary">${v[1]}</span>
                </a>
            </li>
            `).join('\n');
        }
        listOnglet += state.tabs.tabsUIs.slice(1, 3).map((v, i, a) => `
        <li class="nav-item">
            <a class="nav-link" href="#"  onclick="actions.changeTab({lang: '${v[0]}'})">${languages[v[0]]}
            <span class="badge badge-primary">${v[1]}</span>
            </a>
        </li>
        `).join('\n');

        return listOnglet;
    },
    otherLangage(model, state) {
        let otherLangage = "";
        if (state.tabs.tabsUIs.length >= 3) {
            otherLangage = state.tabs.tabsUIs.slice(3).map((v, i, a) => `
            <option value="${v[0]}">${languages[v[0]]} (${v[1]})</option>
            `).join('\n');
        }
        return otherLangage;
    },
    listPage(model, state) {
        let listPage = "";
        let cpt = 0;
        if (model.ongletActive === "traductions") {
            if (model.translations.values.length <= model.pagination.numberperpage) {
                return `
                <li class="page-item active">
                    <a class="page-link" href="#">1</a>
                </li>
                `
            } else {
                let i = 0;
                while (i <= model.translations.values.length) {
                    console.log(i);
                    cpt++;
                    listPage += `
                    <li class="page-item">
                        <a class="page-link" href="#">${cpt}</a>
                    </li>

                    `
                    i += model.pagination.numberperpage;
                }
                return listPage;
            }
        } else {

        }
    },


};
var main = document.getElementById("main")
var menu_construct =
`
<div class="button" id="train_ptrain" onclick="load_train()">Train / Ptrain</div>
    
<div class="button" id="grind_rate" onclick="load_grindrate()">Grind Rate</div>

<div class="button" id="stat_rate" onclick="load_statrate()">Stat Rate</div>

<div id="github">
  <a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
</div>
`
var train_construct =
`
  <input id="base" maxlength="3" class="inputs" placeholder="Base">

  <input id="stat" maxlength="3" class="inputs" placeholder="Stat">

  <input id="weaponatk" maxlength="2" class="inputs" placeholder="Weapon ATK">

  <div id="ptrain" class="button" onclick="ptrain()">Ptrain: No</div>

  <div id="mage" class="button" onclick="mage()">Mage: No</div>

  <div class="button" id="calculate" onclick="train()">Train</div>

  <div class="button" id="menu" onclick="load_menu()">Menu</div>

  <div id="github">
    <a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
  </div>
`
var exp_construct = 
`
  <input id="base1" maxlength="3" class="inputs" placeholder="Initial Level">

  <input id="base2" maxlength="3" class="inputs" placeholder="Goal Level">

  <input id="grindrate" class="inputs" placeholder="EXP / HR ">

  <div class="button" id="calculate" onclick="grind()">Calculate</div>

  <div class="button" id="menu" onclick="load_menu()">Menu</div>
  
  <div id="github">
    <a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
  </div>
`
var stat_construct =
`
  <input id="stat1" maxlength="3" class="inputs" placeholder="Initial Stat">

  <input id="stat2" maxlength="3" class="inputs" placeholder="Goal Stat">

  <div class="button" id="calculate" onclick="stat()">Calculate</div>

  <div class="button" id="menu" onclick="load_menu()">Menu</div>

  <div id="github">
    <a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
  </div>
`

main.innerHTML = menu_construct

function load_train() {main.innerHTML = train_construct}
function load_grindrate() {main.innerHTML = exp_construct}
function load_statrate() {main.innerHTML = stat_construct}
function load_menu() {main.innerHTML = menu_construct}

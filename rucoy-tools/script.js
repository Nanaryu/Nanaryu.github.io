//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////SITE BUILDER//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var main = document.getElementById("main")
var menu_construct =
`

`
var train_construct =
`
<table>
  <tr>
    <td><h2 id="header">&nbsp;&nbsp;&nbsp;Rucoy Online Calculator&nbsp;&nbsp;</h2></td>
    <td><h3 id="subheader">Train Mobs</h3></td>
  </tr>
  <tr>
    <td><input id="base" maxlength="3" class="inputs" placeholder="Base"></td>
  </tr>
  <tr>
    <td><input id="stat" maxlength="3" class="inputs" placeholder="Stat"></td>
  </tr>
  <tr>
    <td>
      <input id="weaponatk" maxlength="2" class="inputs" placeholder="Weapon ATK">
    </td>
  </tr>
  <tr>
    <td>
      <input id="ptrain" class="inputs" onclick="ptrain()" placeholder="Ptrain: Off" readonly>
    </td>
  </tr>
  <tr>
    <td>
      <input id="mage" class="inputs" onclick="mage()" placeholder="Mage: Off" readonly>
    </td>
  </tr>
  <tr>
    <td>
      <button class="button" id="calculate" onclick="train()">Train</button>
    </td>
  </tr>
  <tr>
    <td><p id="result"></p></td>
  </tr>
  <tr>
    <td>
      <button class="button" id="menu" onclick="load_menu()">Menu</button>
    </td>
  </tr>
  <tr>
    <td>
      <a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
    </td>
  </tr>
</table>
`
var exp_construct = 
`
<table>
  <tr>
    <td><h2 id="header">&nbsp;&nbsp;&nbsp;Rucoy Online Calculator&nbsp;&nbsp;</h2></td>
    <td><h3 id="subheader">Grind Rate</h3></td>
  </tr>
  <tr>
    <td><input id="base1" maxlength="3" class="inputs" placeholder="Initial Level"></td>
  </tr>
  <tr>
    <td><input id="base2" maxlength="3" class="inputs" placeholder="Goal Level"></td>
  </tr>
  <tr>
    <td>
      <input id="grindrate" class="inputs" placeholder="EXP / HR ">
    </td>
  </tr>
  <tr>
    <td>
      <button class="button" id="calculate" onclick="grind()">Calculate</button>
    </td>
  </tr>
  <tr>
    <td><p id="result"></p></td>
  </tr>
  <tr>
    <td>
      <button class="button" id="menu" onclick="load_menu()">Menu</button>
    </td>
  </tr>
  <tr>
    <td>
      <a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
    </td>
  </tr>
</table>
`

//main.innerHTML = menu_construct

function load_train() {main.innerHTML = train_construct}
function load_grindrate() {main.innerHTML = exp_construct}
function load_menu() {main.innerHTML = menu_construct}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////MOB DATA/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const mobs = [
  ["Rat 1", 4, 25],
  ["Rat 3", 7, 35],
  ["Crow 6", 13, 40],
  ["Wolf 9", 17, 50],
  ["Scorpion 12", 18, 50],
  ["Cobra 13", 18, 55],
  ["Worm 14", 19, 55],
  ["Goblin 15", 21, 60],
  ["Mummy 25", 36, 80],
  ["Pharaoh 35", 51, 100],
  ["Assassin 45", 71, 120],
  ["Assassin 50", 81, 140],
  ["Assassin 55", 91, 160],
  ["Skeleton Archer 80", 101, 300],
  ["Zombie 65", 106, 200],
  ["Skeleton 75", 121, 300],
  ["Skeleton Warrior 90", 146, 375],
  ["Vampire 100", 171, 450],
  ["Vampire 110", 186, 530],
  ["Drow Ranger 125", 191, 600],
  ["Drow Mage  130", 191, 600],
  ["Drow Assassin 120", 221, 620],
  ["Drow Sorceress 140", 221, 600],
  ["Drow Fighter 135", 246, 680],
  ["Lizard Archer 160", 271, 650],
  ["Dead Eyes 170", 276, 600],
  ["Lizard Shaman 170", 276, 600],
  ["Lizard Warrior 150", 301, 680],
  ["Djinn 150", 301, 640],
  ["Lizard High Shaman 190", 326, 740],
  ["Gargoyle 190", 326, 740],
  ["Dragon Hatchling  240", 331, 10000],
  ["Lizard Captain 180", 361, 815],
  ["Dragon 250", 501, 20000],
  ["Minotaur 225", 511, 4250],
  ["Minotaur 250", 591, 5000],
  ["Dragon Warden 280", 626, 30000],
  ["Ice Elemental 300", 676, 40000],
  ["Minotaur 275", 681, 5750],
  ["Ice Dragon 320", 726, 50000],
  ["Yeti 350", 826, 60000],
]

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////MOB TRAINING////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function auto_min_raw_damage_Calc(stat, weaponatk, base)
{
  var auto_min_raw_damage = (stat * weaponatk)/20 + (base)/4
  return auto_min_raw_damage
}
    
function auto_max_raw_damage_Calc(stat, weaponatk, base)
{
  return (stat * weaponatk)/10 + (base)/4
}

function special_meldist_min_raw_damage_Calc(stat, weaponatk, base)
{
  return 1.5*((stat * weaponatk)/20 +(base)/4)
}

function special_meldist_max_raw_damage_Calc(stat, weaponatk, base)
{
  return 1.5*((stat * weaponatk)/10 +(base)/4)
}

function special_magic_min_raw_damage_Calc(stat, weaponatk, base)
{
  return 1.5*(((1.05*(stat) * weaponatk)/20) + 9*(base)/32)
}

function special_magic_max_raw_damage_Calc(stat, weaponatk, base)
{
  return 1.5*(((1.05*(stat) * weaponatk)/10) + 9*(base)/32)
}
    
function min_damage_Calc(min_raw_damage, pos)
{
  var min_damage = min_raw_damage - mobs[pos][1]
  if (min_damage < 0){
    min_damage = 0
  }
  return min_damage
}

function max_damage_Calc(max_raw_damage, pos)
{
  return max_raw_damage - mobs[pos][1]
}

function max_raw_crit_damage_Calc(max_raw_damage)
{
  return max_raw_damage * 1.05
}

function max_crit_damage_Calc(max_raw_crit_damage, pos)
{
  return max_raw_crit_damage - mobs[pos][1]
}
  
function normal_accuracy_Calc(max_raw_damage, min_raw_damage, x)
{
  var normalaccuracy = (max_raw_damage-mobs[x][1])/(max_raw_damage - min_raw_damage)
  if (normalaccuracy > 1.00)
      normalaccuracy = 1.00
  return normalaccuracy
}
    
function crit_accuracy_Calc(max_raw_crit_damage, max_raw_damage, x)
{
  var critaccuracy = (max_raw_crit_damage-mobs[x][1])/(max_raw_crit_damage - max_raw_damage)
  if (critaccuracy > 1.00)
      critaccuracy = 1.00
  return critaccuracy
}
    
function accuracy_Calc(max_raw_crit_damage, max_raw_damage, min_raw_damage, x)
{
  return (normal_accuracy_Calc(max_raw_damage, min_raw_damage, x)*0.99) + (crit_accuracy_Calc(max_raw_crit_damage, max_raw_damage, x)*0.01)
}

function total_accuracy_Calc(accuracy, tick)
{
  return 1.0 - Math.pow(Math.pow(1.0-accuracy,tick),10)
}

function average_damage_Calc(accuracy, max_damage, min_damage, max_crit_damage){
  return (accuracy)*(.99*((max_damage + min_damage)/2)) + 0.01*((max_crit_damage + max_damage)/2)
}
    
function time_to_kill(avgdmg, pos)
{
  return mobs[pos][2] / avgdmg
}

function tickrate_Calc(accuracy, maxtickrate) 
{
  return maxtickrate*(1.0 - Math.pow(1.0-accuracy,10.0))
}

function powertickrate_Calc(totalaccuracy, maxtickrate)
{
  return maxtickrate*totalaccuracy
}

function max_tickrate_Calc(tick)
{
  if (tick <= 5) {
      return tick * 3600
  } else {
      return 18000
  }
}

function threshold_Calc(tick)
{
  return 1.0 - Math.pow(.8251,(1.0/tick))
}

var ptrain_state = false
function ptrain()
{
  var ptrainbox = document.getElementById("ptrain")
  var magebox = document.getElementById("mage")
  if (!ptrain_state)
  {
    ptrainbox.style.backgroundColor = "rgb(60, 163, 31)"
    ptrainbox.style.borderColor = "rgb(60, 163, 31)"
    ptrainbox.placeholder = "Ptrain: On"
    ptrain_state = true
  }
  else
  {
    ptrainbox.style.backgroundColor = "rgb(100, 100, 100)"
    ptrainbox.style.borderColor = "rgb(100, 100, 100)"
    ptrainbox.placeholder = "Ptrain: Off"
    ptrain_state = false
    if (mage_state)
    {
      magebox.style.backgroundColor = "rgb(100, 100, 100)"
      magebox.style.borderColor = "rgb(100, 100, 100)"
      magebox.placeholder = "Mage: Off"
      mage_state = false
    }
  }
}

var mage_state = false
function mage()
{
  var magebox = document.getElementById("mage") 
  if (ptrain_state)
  {
    if (!mage_state)
    {
      magebox.style.backgroundColor = "rgb(60, 163, 31)"
      magebox.style.borderColor = "rgb(60, 163, 31)"
      magebox.placeholder = "Mage: On"
      mage_state = true
    }
    else
    {
      magebox.style.backgroundColor = "rgb(100, 100, 100)"
      magebox.style.borderColor = "rgb(100, 100, 100)"
      magebox.placeholder = "Mage: Off"
      mage_state = false
    }
  }
}


function train()
{
  let str0 = "" //You can train effectively on...
  let str1 = "" //Max Damage...
  let str2 = "" //Average time to kill...
  let str3 = "" //Average time to kill...
  let str4 = "" //You need...
  let str5 = "" //You deal...

  let weaponatk = parseFloat(document.getElementById("weaponatk").value)
  let base = parseFloat(document.getElementById("base").value)
  let stat = parseFloat(document.getElementById("stat").value)

  if (!ptrain_state)
  { // ===================================IF NOT PTRAIN BRACKET=====================================================

  let min_raw_damage = auto_min_raw_damage_Calc(stat, weaponatk, base)
  let max_raw_damage = auto_max_raw_damage_Calc(stat, weaponatk, base)
  let max_raw_crit_damage = max_raw_crit_damage_Calc(max_raw_damage)
  let accuracy = 0
  let pos = 0

  for (let x = mobs.length - 1; x >= 0 ;x--) {
    if (x === 26 || x === 31) {
      continue
    }
    accuracy = accuracy_Calc(max_raw_crit_damage, max_raw_damage, min_raw_damage, x)
    if (accuracy >= 0.1749) {
      pos = x
      break
    }
  }

  let min_damage = min_damage_Calc(min_raw_damage, pos)
  let max_damage = max_damage_Calc(max_raw_damage, pos)
  let max_crit_damage = max_crit_damage_Calc(max_raw_crit_damage, pos)
  let avgdmg = average_damage_Calc(accuracy, max_damage, min_damage, max_crit_damage)
  let tickrate = tickrate_Calc(accuracy, 3600)
  

  var onemob = true
  var checknextmob = true
  var newpos = pos + 1

  if (pos == 5 || pos == 20 || pos == 22 || pos == 28 || pos == 30) 
  {
    pos--
    onemob = false
  }
  if (newpos > 40) 
  {
    checknextmob = false
  }
  if (newpos == 26 || newpos == 31)
  {
    newpos++
  }

  var time = time_to_kill(avgdmg, pos)

  str0 = `You can train effectively on <span class="info">${mobs[pos][0]}</span>.`
  if (!onemob)
  {
    let time2 = time_to_kill(avgdmg, pos+1)
    str0 = `You can train effectively on <span class="info">${mobs[pos][0]}</span> & <span class="info">${mobs[pos+1][0]}</span>.`
    str3 = `Average time to kill <span class="info">${mobs[pos+1][0]}</span>: <span class="time">${Math.round(time2/60)} min. ${Math.round(time2%60)} sec.</span>`
  }

  let statadd = 0
  let checked = false
  let alrdealdamage = false
  let dealdamage = false
  let new_max_damage
  let newaccuracy = 0

  while (newaccuracy < 0.1749 && checknextmob) 
  {
      let statneeded = stat + statadd

      let new_min_raw_damage = auto_min_raw_damage_Calc(statneeded, weaponatk, base)
      let new_max_raw_damage = auto_max_raw_damage_Calc(statneeded, weaponatk, base)

      let new_max_raw_critdamage = max_raw_crit_damage_Calc(new_max_raw_damage)

      new_max_damage = max_damage_Calc(new_max_raw_damage, newpos)
      newaccuracy = accuracy_Calc(new_max_raw_critdamage, new_max_raw_damage, new_min_raw_damage, newpos);

      if (new_max_damage >= 1 && !checked)  //if you can already deal damage to the next mob
      {
          str5 = `You can deal <span class="numbers">${Math.round(new_max_damage)}</span> max damage to <span class="info">${mobs[newpos][0]}</span>!` //part of output
          alrdealdamage = true
      }
      else if (new_max_damage > 1 && !alrdealdamage && !dealdamage) //if you cant deal damage to the next mob yet, you can deal damage in a certain amount of stats!
      { 
          str5 = `You can deal <span class="numbers">${Math.round(new_max_damage)}</span> max damage to <span class="info">${mobs[newpos][0]}</span> in <span class="numbers">${statadd}</span> stats!` //part of output
          dealdamage = true
      }
      checked = true
      statadd++
  }
  if (checknextmob) 
  {
      str1 = `Max. Damage: <span class="numbers">${Math.round(max_damage)}</span> Tickrate: <span class="numbers">${Math.round(tickrate)}</span> / <span class="numbers">3600</span>`
      str2 = `Average time to kill <span class="info">${mobs[pos][0]}</span>: <span class="time">${Math.round(time/60)} min. ${Math.round(time%60)} sec.</span>`
      str4 = `You need <span class="numbers">${statadd}</span> stats to train effectively on <span class="info">${mobs[newpos][0]}</span>!`
  }
  else 
  {
      str1 = `Min. Damage (Auto): ${Math.round(min_damage)} Max. Damage (Auto): ${Math.round(max_damage)}`
      str2 = `Average time to kill ${mobs[pos][0]}: ${Math.round(time/60)} min. ${Math.round(time%60)} sec.`
  }
  
  if (str3 === "")
  {
    document.getElementById("result").innerHTML = str0 + "<br>" + str1 + "<br>" + str2 + "<br>" + str4 + "<br>" + str5
  }
  else
  {
    document.getElementById("result").innerHTML = str0 + "<br>" + str1 + "<br>" + str2 + "<br>" + str3 + "<br>" + str4 + "<br>" + str5
  }

  } // ===================================IF NOT PTRAIN BRACKET=====================================================
  else
  { // =====================================IF PTRAIN BRACKET=======================================================
    let max_raw_damage
    let min_raw_damage

    if (mage_state) 
    {
      min_raw_damage = special_magic_min_raw_damage_Calc(stat, weaponatk, base)
      max_raw_damage = special_magic_max_raw_damage_Calc(stat, weaponatk, base)
    } 
    else 
    {
      min_raw_damage = special_meldist_min_raw_damage_Calc(stat, weaponatk, base)
      max_raw_damage = special_meldist_max_raw_damage_Calc(stat, weaponatk, base)
    }

    let max_raw_crit_damage = max_raw_crit_damage_Calc(max_raw_damage)
    let accuracy = 0
    let pos = 0
    let tick = 4
    let threshold = threshold_Calc(tick)

    //Iterate through loop until you find a mob you can power train on with greater than .1749 accuracy
    for (let x = mobs.length-1; x >= 0; x--) 
    {
      if (x == 13 || x == 19 || x == 20 || x == 22 || x == 24 || x == 25 || x == 26 || x == 29 || x == 31 || x == 33 || x == 36 || x == 37 || x >= 39) 
      {
        continue
      }

      accuracy = accuracy_Calc(max_raw_crit_damage, max_raw_damage, min_raw_damage, x)

      if (accuracy >= threshold) 
      {
          pos = x
          break
      }
    }

    //Calculate average damage which you need for average time to kill
    let min_damage = min_damage_Calc(min_raw_damage, pos)
    let max_damage = max_damage_Calc(max_raw_damage, pos)
    let max_crit_damage = max_crit_damage_Calc(max_raw_crit_damage, pos)
    let avgdmg = average_damage_Calc(accuracy, max_damage, min_damage, max_crit_damage)
    let totalaccuracy = total_accuracy_Calc(accuracy, tick)
    let maxtickrate = max_tickrate_Calc(tick)
    let powertickrate = powertickrate_Calc(totalaccuracy, maxtickrate)
    let time = time_to_kill(avgdmg, pos)

    str0 = `You can power train on on <span class="info">${mobs[pos][0]}</span>.`

    //calculating stats you need to train on the next mob

    let statadd = 0
    let checked = false
    let alrdealdamage = false
    let dealdamage = false
    let new_max_damage
    let newaccuracy = 0
    let newpos = pos + 1

    while (true) 
    {
        if (newpos == 13 || newpos == 19 || newpos == 20 || newpos == 22 || newpos == 24 || newpos == 25 || newpos == 26 || newpos == 29 || newpos == 31 || newpos == 33 || newpos == 36 || newpos == 37) 
        {
            newpos++
        }
        else if (newpos >= 38) 
        {
            newpos = 38
            break
        }
        else 
        {
            break
        }
    }

    let checknextmob = pos != 38

    while (newaccuracy < threshold && checknextmob) 
    {
      let statneeded = stat + statadd

      let new_max_raw_damage
      let new_min_raw_damage

        if (mage_state) 
        {
            new_min_raw_damage = special_magic_min_raw_damage_Calc(statneeded, weaponatk, base)
            new_max_raw_damage = special_magic_max_raw_damage_Calc(statneeded, weaponatk, base)
        } 
        else 
        {
            new_min_raw_damage = special_meldist_min_raw_damage_Calc(statneeded, weaponatk, base)
            new_max_raw_damage = special_meldist_max_raw_damage_Calc(statneeded, weaponatk, base)
        }

        let new_max_raw_crit_damage = max_raw_crit_damage_Calc(new_max_raw_damage)

        new_max_damage = max_damage_Calc(new_max_raw_damage, newpos)

        newaccuracy = accuracy_Calc(new_max_raw_crit_damage, new_max_raw_damage, new_min_raw_damage, newpos)
        
        if (new_max_damage >= 1 && !checked) //if you can already deal damage to the next mob
        { 
            str4 = `You can deal <span class="numbers">${Math.round(new_max_damage)}</span> max damage to <span class="info">${mobs[newpos][0]}</span>!` //part of output
            alrdealdamage = true
        }
        else if (new_max_damage > 1 && !alrdealdamage && !dealdamage) //if you cant deal damage to the next mob yet, you can deal damage in a certain amount of stats!
        { 
            str4 = `You can deal <span class="numbers">${Math.round(new_max_damage)}</span> max damage to <span class="info">${mobs[newpos][0]}</span> in <span class="numbers">${statadd}</span> stats!` //part of output
            dealdamage = true
        }
        checked = true
        statadd++
    }

    //Building remaining Strings
    if (checknextmob) 
    {
        str1 = `Max. Damage: <span class="numbers">${Math.round(max_damage)}</span> Tickrate: <span class="numbers">${Math.round(powertickrate)}</span> / <span class="numbers">${Math.round(maxtickrate)}</span>`
        str2 = `Average time to kill <span class="info">${mobs[pos][0]}</span>: <span class="time">${Math.round(time/60)} min. ${Math.round(time%60)} sec.</span>`
        str3 = `You need <span class="numbers">${statadd}</span> stats to power train effectively on <span class="info">${mobs[newpos][0]}</span>!`
    }
    else 
    {
        str1 = `Min. Damage (Auto): ${Math.round(min_damage)} Max. Damage (Auto): ${Math.round(max_damage)}`
        str2 = `Average time to kill ${mobs[pos][0]}: ${Math.round(time/60)} min. ${Math.round(time%60)} sec.`
    }
    document.getElementById("result").innerHTML = str0 + "<br>" + str1 + "<br>" + str2 + "<br>" + str3 + "<br>" + str4
  } // =====================================IF PTRAIN BRACKET=======================================================
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////LEVEL GRIND//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function exp_Calc(base)
{
  return Math.pow(base, (base / 1000) + 3)
}

function parseShorthand(input) {
  const shorthandMap = {
    'k': 1000,
    'kk': 1000000,
    'kkk': 1000000000,
  };

  const regex = /^(\d*\.?\d+)([k]+)?$/i
  const match = input.match(regex)

  if (match) {
    const value = parseFloat(match[1])
    const suffix = match[2] ? match[2].toLowerCase() : ''

    if (shorthandMap.hasOwnProperty(suffix)) {
      return value * shorthandMap[suffix];
    } else {
      return value
    }
  } else {
    // Invalid input, return NaN or handle as needed
    return NaN
  }
}

function grind()
{
  let str0 = `` // You need....
  let str1 = `` // This is around....
  let str2 = `` // or x hours...
  base1 = parseFloat(document.getElementById("base1").value)
  base2 = parseFloat(document.getElementById("base2").value)
  grindRate = parseShorthand(document.getElementById("grindrate").value)
  if (base1 > base2)
  {
    document.getElementById("result").innerHTML = "Goal level must be larger than initial level"
  }
  str0 = `You need <span class="numbers">${Math.round(exp_Calc(base2) - exp_Calc(base1))}</span> experience until you reach base level <span class="numbers">${base2}</span>`
  str1 = `This is around <span class="time">${Math.round(60 * ((exp_Calc(base2) - exp_Calc(base1)) / grindRate))}</span> minutes,`
  str2 = `or <span class="time">${Math.round((exp_Calc(base2) - exp_Calc(base1)) / grindRate)}</span> hours of grinding at a rate of <span class="numbers">${grindRate}</span> exp/hr!`

  document.getElementById("result").innerHTML = str0 + "<br>" + str1 + "<br>" + str2
}
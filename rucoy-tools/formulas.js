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

function consistency_Calc(max_raw_crit_damage,max_raw_damage, min_raw_damage, mob) 
{
        let health = mobs[mob][2];
        let defense = mobs[mob][1];
        let totaldefense = health + defense;

        if (totaldefense - max_raw_crit_damage > 0) {
            return 0;
        }

        let range = max_raw_damage - min_raw_damage;
        let normaloneshots = max_raw_damage - totaldefense;
        if (normaloneshots > 0) {
            let normalconsistency = (normaloneshots/range);
            return normalconsistency*0.99 + 0.01;
        } else {
            let critrange = max_raw_crit_damage - max_raw_damage;
            let criticaloneshots = max_raw_crit_damage - totaldefense;
            return (criticaloneshots/critrange)*0.01;
        }
}

function stat0to54_Calc(stat)
{
    return Math.pow(stat, (stat/1000) + 2.373);
}

function stat55to99_Calc(stat)
{
    return Math.pow(stat, (stat/1000) + 2.171);
}

var ptrain_state = false
function ptrain()
{
  var ptrainbox = document.getElementById("ptrain")
  var magebox = document.getElementById("mage")
  if (!ptrain_state)
  {
    ptrainbox.style.backgroundColor = "rgb(56, 245, 103)"
    ptrainbox.style.boxShadow = "0 0 10px rgba(56, 245, 103, 0.65)"
    ptrainbox.innerHTML= "Ptrain: Yes"
    ptrain_state = true
  }
  else
  {
    ptrainbox.style.backgroundColor = "rgba(255,255,255,0.8)"
    ptrainbox.style.boxShadow = "none"
    ptrainbox.innerHTML = "Ptrain: No"
    ptrain_state = false
    if (mage_state)
    {
      magebox.style.backgroundColor = "rgba(255,255,255,0.8)"
      magebox.style.boxShadow = "none"
      magebox.innerHTML = "Mage: No"
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
      magebox.style.backgroundColor = "rgb(56, 245, 103)"
      magebox.style.boxShadow = "0 0 10px rgba(56, 245, 103, 0.65)"
      magebox.innerHTML = "Mage: Yes"
      mage_state = true
    }
    else
    {
      magebox.style.backgroundColor = "rgba(255,255,255,0.8)"
      magebox.style.boxShadow = "none"
      magebox.innerHTML = "Mage: No"
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

  if(!document.getElementById("result"))
  {
    result = document.createElement("span")
    result.id = "result"

    document.getElementById("main").insertBefore(result, document.getElementById("menu"))
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

    if(!document.getElementById("result"))
    {
      result = document.createElement("span")
      result.id = "result"

      document.getElementById("main").insertBefore(result, document.getElementById("menu"))
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

  if(!document.getElementById("result"))
  {
    result = document.createElement("span")
    result.id = "result"

    document.getElementById("main").insertBefore(result, document.getElementById("menu"))
  }
  
  if (base1 > base2)
  {
    document.getElementById("result").innerHTML = "Goal level must be larger than initial level."
  }
  str0 = `You need <span class="numbers">${Math.round(exp_Calc(base2) - exp_Calc(base1))}</span> experience until you reach base level <span class="numbers">${base2}</span>`
  str1 = `This is around <span class="time">${Math.round(60 * ((exp_Calc(base2) - exp_Calc(base1)) / grindRate))}</span> minutes,`
  str2 = `or <span class="time">${Math.round((exp_Calc(base2) - exp_Calc(base1)) / grindRate)}</span> hours of grinding at a rate of <span class="numbers">${grindRate}</span> exp/hr!`

  document.getElementById("result").innerHTML = str0 + "<br>" + str1 + "<br>" + str2
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////STAT CALC////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function stat() 
{
    let stat1 = parseFloat(document.getElementById("stat1").value)
    let stat2 = parseFloat(document.getElementById("stat2").value)
    if (stat1 > stat2) 
    {
        return NaN
    }
    let ticks1;
    let ticks2;
    if (stat1 <= 54) {
        ticks1 = stat0to54_Calc(stat1);
    } else {
        ticks1 = stat55to99_Calc(stat1);
    } 
    
    if (stat2 <= 54) {
        ticks2 = stat0to54_Calc(stat2);
    } else {
        ticks2 = stat55to99_Calc(stat2);
    }

    let totalTicks = ticks2 - ticks1;
    
    let mana_1 = Math.floor(50 * totalTicks / 4);
    let mana_1_5 = Math.floor(50 * totalTicks / 6);
    let mana_2 = Math.floor(50 * totalTicks / 8);
    let mana_2_5 = Math.floor(50 * totalTicks / 10);

    if(!document.getElementById("result"))
    {
        result = document.createElement("span")
        result.id = "result"

        document.getElementById("main").insertBefore(result, document.getElementById("menu"))
    }

    document.getElementById("result").innerHTML = 
    `
    AFK Train: <span class='time'>${Math.floor(totalTicks / 3600)}</span>h<br>
    PTrain: <span class='time'>${Math.floor(totalTicks / 14400)}</span>h<br>
    <!-- Cost: ${Math.floor(mana_1 / 100)} small pots, ${Math.floor(mana_1 / 250)} greater pots, ${Math.floor(mana_1 / 500)} super pots, or ${Math.floor(mana_1 / 750)} ulti pots. -->
    
    AFK Train <span class='numbers'>1.5x</span>: <span class='time'>${Math.floor(totalTicks / (3600 * 1.5))}</span>h<br>
    PTrain <span class='numbers'>1.5x</span>: <span class='time'>${Math.floor(totalTicks / (14400 * 1.5))}</span>h<br>
    <!-- Cost: ${Math.floor(mana_1_5 / 100)} small pots, ${Math.floor(mana_1_5 / 250)} greater pots, ${Math.floor(mana_1_5 / 500)} super pots, or ${Math.floor(mana_1_5 / 750)} ulti pots. -->

    AFK Train <span class='numbers'>2x</span>: <span class='time'>${Math.floor(totalTicks / (3600 * 2))}</span>h<br>
    PTrain <span class='numbers'>2x</span>: <span class='time'>${Math.floor(totalTicks / (14400 * 2))}</span>h<br>
    <!-- Cost: ${Math.floor(mana_2 / 100)} small pots, ${Math.floor(mana_2 / 250)} greater pots, ${Math.floor(mana_2 / 500)} super pots, or ${Math.floor(mana_2 / 750)} ulti pots. -->

    AFK Train <span class='numbers'>2.5x</span>: <span class='time'>${Math.floor(totalTicks / (3600 * 2.5))}</span>h<br>
    PTrain <span class='numbers'>2.5x</span>: <span class='time'>${Math.floor(totalTicks / (14400 * 2.5))}</span>h<br>
    <!-- Cost: ${Math.floor(mana_2_5 / 100)} small pots, ${Math.floor(mana_2_5 / 250)} greater pots, ${Math.floor(mana_2_5 / 500)} super pots, or ${Math.floor(mana_2_5 / 750)} ulti pots. -->
    `;
}
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
    
function max_raw_crit_damage_Calc(max_raw_damage)
{
  return max_raw_damage * 1.05
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

function max_crit_damage_Calc(max_raw_crit_damage, pos)
{
  return max_raw_crit_damage - mobs[pos][1]
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
  

  var onemob = true;
  var checknextmob = true;
  var newpos = pos + 1;

  if (pos == 5 || pos == 20 || pos == 22 || pos == 28 || pos == 30) 
  {
    pos--
    onemob = false
  }
  if (newpos > 40) 
  {
    checknextmob = false
  }
  if (newpos == 26||newpos == 31)
  {
    newpos++
  }

  var kill_time = time_to_kill(avgdmg, pos)

  str0 = `You can train effectively on ${mobs[pos][0]}`
  str3 = `Average time to kill ${mobs[pos][0]}: ${Math.round(kill_time/60)} min. ${Math.round(kill_time%60)} sec.`
  if (!onemob)
  {
    kill_time = time_to_kill(avgdmg, pos+1)
    str0 = `You can train effectively on ${mobs[pos][0]} & ${mobs[pos+1][0]}`
    str3 = `Average time to kill ${mobs[pos+1][0]}: ${Math.round(kill_time/60)} min. ${Math.round(kill_time%60)} sec.`
  }
  

  document.getElementById("result").innerHTML = str0 + "<br>" + str3
}
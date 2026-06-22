const DATA_URL = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json'
// 若要儲存進度，請把下面的 URL 換成你部署後的 Apps Script 網址（Web app）
const GAS_URL = 'YOUR_GAS_WEBAPP_URL'
let elements = []
const container = document.getElementById('table-container')
const searchInput = document.getElementById('search')
const flashBtn = document.getElementById('flashBtn')
const quizBtn = document.getElementById('quizBtn')

fetch(DATA_URL).then(r=>r.json()).then(j=>{
  elements = j.elements.sort((a,b)=>a.atomicNumber-b.atomicNumber)
  renderTable()
}).catch(e=>{container.textContent='無法載入元素資料，請檢查網路。'})

function renderTable(){
  // create 7 periods plus f-block spacing: we'll map position by x/y if available
  container.innerHTML = ''
  // simple layout: create 18*7 grid and place elements using 'xpos' and 'ypos' from data
  const grid = Array.from({length:7},()=>Array(18).fill(null))
  elements.forEach(el=>{
    const x = (el.xpos||1)-1
    const y = (el.ypos||1)-1
    if(y<7 && x<18) grid[y][x]=el
  })
  for(let r=0;r<7;r++){
    for(let c=0;c<18;c++){
      const el = grid[r][c]
      const div = document.createElement('div')
      div.className='element'
      if(!el){ div.style.visibility='hidden'; container.appendChild(div); continue }
      div.innerHTML = `<div class="el-num">${el.atomicNumber}</div><div class="el-symbol">${el.symbol}</div><div class="el-name">${el.name}</div>`
      div.title = `${el.name} (${el.symbol})`
      div.addEventListener('click',()=>openFlashcardByEl(el))
      container.appendChild(div)
    }
  }
}

searchInput.addEventListener('input',e=>{
  const q = e.target.value.trim().toLowerCase()
  if(!q) return renderTable()
  const found = elements.filter(el=>el.symbol.toLowerCase().includes(q)||el.name.toLowerCase().includes(q))
  container.innerHTML=''
  found.forEach(el=>{
    const div=document.createElement('div');div.className='element';div.innerHTML=`<div class="el-num">${el.atomicNumber}</div><div class="el-symbol">${el.symbol}</div><div class="el-name">${el.name}</div>`;div.addEventListener('click',()=>openFlashcardByEl(el));container.appendChild(div)
  })
})

// Flashcards
const flashSection = document.getElementById('flashcard')
const cardFront = document.getElementById('card-front')
const cardBack = document.getElementById('card-back')
const prevBtn = document.getElementById('prev')
const nextBtn = document.getElementById('next')
const revealBtn = document.getElementById('reveal')
const exitFlash = document.getElementById('exitFlash')
let flashIndex = 0
const userNameInput = document.getElementById('userName')
const autoFillBtn = document.getElementById('autoFillBtn')
const saveProgressBtn = document.getElementById('saveProgress')

flashBtn.addEventListener('click',()=>startFlashcards())
function startFlashcards(){
  flashIndex = 0
  showFlash()
}

autoFillBtn.addEventListener('click',()=>{
  // 從已載入的 elements 中隨機挑一個並打開為 flashcard
  if(!elements.length) return alert('元素資料尚未載入')
  const idx = Math.floor(Math.random()*elements.length)
  openFlashcardByEl(elements[idx])
})

function openFlashcardByEl(el){
  flashIndex = elements.findIndex(e=>e.atomicNumber===el.atomicNumber)
  showFlash()
}

function showFlash(){
  flashSection.classList.remove('hidden')
  document.getElementById('table-container').style.display='none'
  const el = elements[flashIndex]
  cardFront.textContent = `${el.symbol} — ${el.atomicNumber}`
  cardBack.textContent = `${el.name} • 原子量 ${el.atomicMass}`
  cardBack.classList.add('hidden')
}

revealBtn.addEventListener('click',()=>{cardBack.classList.toggle('hidden')})
prevBtn.addEventListener('click',()=>{flashIndex=(flashIndex-1+elements.length)%elements.length;showFlash()})
nextBtn.addEventListener('click',()=>{flashIndex=(flashIndex+1)%elements.length;showFlash()})
exitFlash.addEventListener('click',()=>{flashSection.classList.add('hidden');document.getElementById('table-container').style.display='grid'})

// 儲存進度到 GAS
saveProgressBtn.addEventListener('click',()=>{
  const el = elements[flashIndex]
  const user = (userNameInput && userNameInput.value) ? userNameInput.value.trim() : '匿名'
  const payload = {timestamp: new Date().toISOString(), user, atomicNumber: el.atomicNumber, symbol: el.symbol, name: el.name}
  if(!GAS_URL || GAS_URL==='YOUR_GAS_WEBAPP_URL') return alert('請先在 script.js 設定 GAS_URL 為你的 Apps Script Web App URL')
  fetch(GAS_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(r=>r.json()).then(j=>{ if(j.success) alert('已儲存') ; else alert('儲存失敗') }).catch(e=>alert('儲存失敗：'+e.message))
})

// Quiz (very simple: pick symbol, ask for name)
const quizSection = document.getElementById('quiz')
const quizArea = document.getElementById('quiz-area')
const exitQuizBtn = document.getElementById('exitQuiz')
quizBtn.addEventListener('click',()=>startQuiz())
exitQuizBtn.addEventListener('click',()=>{quizSection.classList.add('hidden');document.getElementById('table-container').style.display='grid'})

function startQuiz(){
  document.getElementById('table-container').style.display='none'
  quizSection.classList.remove('hidden')
  quizArea.innerHTML=''
  const sample = shuffle([...elements]).slice(0,8)
  sample.forEach(q=>{
    const div = document.createElement('div')
    div.className='q'
    const prompt = document.createElement('div')
    prompt.textContent = `元素符號：${q.symbol}（第 ${q.atomicNumber} 號），名稱是？` 
    const input = document.createElement('input')
    const check = document.createElement('button')
    check.textContent='檢查'
    const result = document.createElement('div')
    check.addEventListener('click',()=>{
      const val = input.value.trim().toLowerCase()
      if(val===q.name.toLowerCase()) result.textContent='正確' , result.style.color='green'
      else result.textContent=`錯誤，答案：${q.name}` , result.style.color='crimson'
    })
    div.append(prompt,input,check,result)
    quizArea.appendChild(div)
  })
}

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

// Exam feature
const examBtn = document.getElementById('examBtn')
const examSection = document.getElementById('exam')
const startExamBtn = document.getElementById('startExam')
const submitExamBtn = document.getElementById('submitExam')
const exitExamBtn = document.getElementById('exitExam')
const examQuestionsEl = document.getElementById('exam-questions')
const examTimerEl = document.getElementById('exam-timer')
const saveExamResultBtn = document.getElementById('saveExamResult')
const examResultEl = document.getElementById('exam-result')

let examTimer = null
let examSecondsLeft = 0
let currentExam = []

examBtn.addEventListener('click',()=>{
  examSection.classList.remove('hidden')
  document.getElementById('table-container').style.display='none'
})

exitExamBtn.addEventListener('click',()=>{
  clearExamState()
  examSection.classList.add('hidden')
  document.getElementById('table-container').style.display='grid'
})

startExamBtn.addEventListener('click',()=>{
  if(!elements.length) return alert('元素資料尚未載入')
  startExam(10, 600) // 10 questions, 600s (10 min)
})

submitExamBtn.addEventListener('click',()=>{gradeExam()})
saveExamResultBtn.addEventListener('click',()=>{
  const user = (userNameInput && userNameInput.value) ? userNameInput.value.trim() : '匿名'
  const payload = {type:'exam', user, score:examResultEl.dataset.score||'', total:examResultEl.dataset.total||'', timestamp:new Date().toISOString()}
  if(!GAS_URL || GAS_URL==='YOUR_GAS_WEBAPP_URL') return alert('請先在 script.js 設定 GAS_URL 為你的 Apps Script Web App URL')
  fetch(GAS_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(r=>r.json()).then(j=>{ if(j.success) alert('成績已儲存') ; else alert('儲存失敗') }).catch(e=>alert('儲存失敗：'+e.message))
})

function startExam(count, seconds){
  currentExam = generateExamQuestions(count)
  renderExamQuestions(currentExam)
  examSecondsLeft = seconds
  updateTimerDisplay()
  if(examTimer) clearInterval(examTimer)
  examTimer = setInterval(()=>{
    examSecondsLeft--
    updateTimerDisplay()
    if(examSecondsLeft<=0){
      clearInterval(examTimer)
      gradeExam()
    }
  },1000)
  startExamBtn.classList.add('hidden')
  submitExamBtn.classList.remove('hidden')
}

function clearExamState(){
  if(examTimer) clearInterval(examTimer)
  examTimer=null
  examQuestionsEl.innerHTML=''
  examResultEl.classList.add('hidden')
  startExamBtn.classList.remove('hidden')
  submitExamBtn.classList.add('hidden')
  saveExamResultBtn.classList.add('hidden')
}

function updateTimerDisplay(){
  const m = Math.floor(examSecondsLeft/60).toString().padStart(2,'0')
  const s = (examSecondsLeft%60).toString().padStart(2,'0')
  examTimerEl.textContent = `剩餘時間：${m}:${s}`
}

function generateExamQuestions(n){
  const pool = shuffle([...elements])
  const qs = pool.slice(0,n).map(el=>{
    const correct = el
    const choices = [correct.name]
    // pick 3 wrong names
    let i=0
    while(choices.length<4 && i<200){
      const cand = elements[Math.floor(Math.random()*elements.length)].name
      if(!choices.includes(cand)) choices.push(cand)
      i++
    }
    return {atomicNumber:correct.atomicNumber, symbol:correct.symbol, name:correct.name, choices:shuffle(choices)}
  })
  return qs
}

function renderExamQuestions(qs){
  examQuestionsEl.innerHTML=''
  qs.forEach((q, idx)=>{
    const div = document.createElement('div')
    div.className='q-item'
    const title = document.createElement('div')
    title.textContent = `${idx+1}. 元素符號：${q.symbol}（第 ${q.atomicNumber} 號）` 
    div.appendChild(title)
    q.choices.forEach((c,ci)=>{
      const id = `exam-q${idx}-c${ci}`
      const label = document.createElement('label')
const DATA_URL = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json'
// 若要儲存進度，請把下面的 URL 換成你部署後的 Apps Script 網址（Web app）
const GAS_URL = 'YOUR_GAS_WEBAPP_URL'
let elements = []
const container = document.getElementById('table-container')
const searchInput = document.getElementById('search')
const flashBtn = document.getElementById('flashBtn')
const quizBtn = document.getElementById('quizBtn')

fetch(DATA_URL).then(r=>r.json()).then(j=>{
  elements = j.elements.sort((a,b)=>a.atomicNumber-b.atomicNumber)
  renderTable()
}).catch(e=>{container.textContent='無法載入元素資料，請檢查網路。'})

function renderTable(){
  // create 7 periods plus f-block spacing: we'll map position by x/y if available
  container.innerHTML = ''
  // simple layout: create 18*7 grid and place elements using 'xpos' and 'ypos' from data
  const grid = Array.from({length:7},()=>Array(18).fill(null))
  elements.forEach(el=>{
    const x = (el.xpos||1)-1
    const y = (el.ypos||1)-1
    if(y<7 && x<18) grid[y][x]=el
  })
  for(let r=0;r<7;r++){
    for(let c=0;c<18;c++){
      const el = grid[r][c]
      const div = document.createElement('div')
      div.className='element'
      if(!el){ div.style.visibility='hidden'; container.appendChild(div); continue }
      div.innerHTML = `<div class="el-num">${el.atomicNumber}</div><div class="el-symbol">${el.symbol}</div><div class="el-name">${el.name}</div>`
      div.title = `${el.name} (${el.symbol})`
      div.addEventListener('click',()=>openFlashcardByEl(el))
      container.appendChild(div)
    }
  }
}

searchInput.addEventListener('input',e=>{
  const q = e.target.value.trim().toLowerCase()
  if(!q) return renderTable()
  const found = elements.filter(el=>el.symbol.toLowerCase().includes(q)||el.name.toLowerCase().includes(q))
  container.innerHTML=''
  found.forEach(el=>{
    const div=document.createElement('div');div.className='element';div.innerHTML=`<div class="el-num">${el.atomicNumber}</div><div class="el-symbol">${el.symbol}</div><div class="el-name">${el.name}</div>`;div.addEventListener('click',()=>openFlashcardByEl(el));container.appendChild(div)
  })
})

// Flashcards
const flashSection = document.getElementById('flashcard')
const cardFront = document.getElementById('card-front')
const cardBack = document.getElementById('card-back')
const prevBtn = document.getElementById('prev')
const nextBtn = document.getElementById('next')
const revealBtn = document.getElementById('reveal')
const exitFlash = document.getElementById('exitFlash')
let flashIndex = 0
const userNameInput = document.getElementById('userName')
const autoFillBtn = document.getElementById('autoFillBtn')
const saveProgressBtn = document.getElementById('saveProgress')

flashBtn.addEventListener('click',()=>startFlashcards())
function startFlashcards(){
  flashIndex = 0
  showFlash()
}

autoFillBtn.addEventListener('click',()=>{
  // 從已載入的 elements 中隨機挑一個並打開為 flashcard
  if(!elements.length) return alert('元素資料尚未載入')
  const idx = Math.floor(Math.random()*elements.length)
  openFlashcardByEl(elements[idx])
})

function openFlashcardByEl(el){
  flashIndex = elements.findIndex(e=>e.atomicNumber===el.atomicNumber)
  showFlash()
}

function showFlash(){
  flashSection.classList.remove('hidden')
  document.getElementById('table-container').style.display='none'
  const el = elements[flashIndex]
  cardFront.textContent = `${el.symbol} — ${el.atomicNumber}`
  cardBack.textContent = `${el.name} • 原子量 ${el.atomicMass}`
  cardBack.classList.add('hidden')
}

revealBtn.addEventListener('click',()=>{cardBack.classList.toggle('hidden')})
prevBtn.addEventListener('click',()=>{flashIndex=(flashIndex-1+elements.length)%elements.length;showFlash()})
nextBtn.addEventListener('click',()=>{flashIndex=(flashIndex+1)%elements.length;showFlash()})
exitFlash.addEventListener('click',()=>{flashSection.classList.add('hidden');document.getElementById('table-container').style.display='grid'})

// 儲存進度到 GAS
saveProgressBtn.addEventListener('click',()=>{
  const el = elements[flashIndex]
  const user = (userNameInput && userNameInput.value) ? userNameInput.value.trim() : '匿名'
  const payload = {timestamp: new Date().toISOString(), user, atomicNumber: el.atomicNumber, symbol: el.symbol, name: el.name}
  if(!GAS_URL || GAS_URL==='YOUR_GAS_WEBAPP_URL') return alert('請先在 script.js 設定 GAS_URL 為你的 Apps Script Web App URL')
  fetch(GAS_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(r=>r.json()).then(j=>{ if(j.success) alert('已儲存') ; else alert('儲存失敗') }).catch(e=>alert('儲存失敗：'+e.message))
})

// Quiz (very simple: pick symbol, ask for name)
const quizSection = document.getElementById('quiz')
const quizArea = document.getElementById('quiz-area')
const exitQuizBtn = document.getElementById('exitQuiz')
quizBtn.addEventListener('click',()=>startQuiz())
exitQuizBtn.addEventListener('click',()=>{quizSection.classList.add('hidden');document.getElementById('table-container').style.display='grid'})

function startQuiz(){
  document.getElementById('table-container').style.display='none'
  quizSection.classList.remove('hidden')
  quizArea.innerHTML=''
  const sample = shuffle([...elements]).slice(0,8)
  sample.forEach(q=>{
    const div = document.createElement('div')
    div.className='q'
    const prompt = document.createElement('div')
    prompt.textContent = `元素符號：${q.symbol}（第 ${q.atomicNumber} 號），名稱是？` 
    const input = document.createElement('input')
    const check = document.createElement('button')
    check.textContent='檢查'
    const result = document.createElement('div')
    check.addEventListener('click',()=>{
      const val = input.value.trim().toLowerCase()
      if(val===q.name.toLowerCase()) result.textContent='正確' , result.style.color='green'
      else result.textContent=`錯誤，答案：${q.name}` , result.style.color='crimson'
    })
    div.append(prompt,input,check,result)
    quizArea.appendChild(div)
  })
}

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

// Exam feature
const examBtn = document.getElementById('examBtn')
const examSection = document.getElementById('exam')
const startExamBtn = document.getElementById('startExam')
const submitExamBtn = document.getElementById('submitExam')
const exitExamBtn = document.getElementById('exitExam')
const examQuestionsEl = document.getElementById('exam-questions')
const examTimerEl = document.getElementById('exam-timer')
const saveExamResultBtn = document.getElementById('saveExamResult')
const examResultEl = document.getElementById('exam-result')

let examTimer = null
let examSecondsLeft = 0
let currentExam = []

examBtn.addEventListener('click',()=>{
  examSection.classList.remove('hidden')
  document.getElementById('table-container').style.display='none'
})

exitExamBtn.addEventListener('click',()=>{
  clearExamState()
  examSection.classList.add('hidden')
  document.getElementById('table-container').style.display='grid'
})

startExamBtn.addEventListener('click',()=>{
  if(!elements.length) return alert('元素資料尚未載入')
  startExam(10, 600) // 10 questions, 600s (10 min)
})

submitExamBtn.addEventListener('click',()=>{gradeExam()})
saveExamResultBtn.addEventListener('click',()=>{
  const user = (userNameInput && userNameInput.value) ? userNameInput.value.trim() : '匿名'
  const payload = {type:'exam', user, score:examResultEl.dataset.score||'', total:examResultEl.dataset.total||'', timestamp:new Date().toISOString()}
  if(!GAS_URL || GAS_URL==='YOUR_GAS_WEBAPP_URL') return alert('請先在 script.js 設定 GAS_URL 為你的 Apps Script Web App URL')
  fetch(GAS_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(r=>r.json()).then(j=>{ if(j.success) alert('成績已儲存') ; else alert('儲存失敗') }).catch(e=>alert('儲存失敗：'+e.message))
})

function startExam(count, seconds){
  currentExam = generateExamQuestions(count)
  renderExamQuestions(currentExam)
  examSecondsLeft = seconds
  updateTimerDisplay()
  if(examTimer) clearInterval(examTimer)
  examTimer = setInterval(()=>{
    examSecondsLeft--
    updateTimerDisplay()
    if(examSecondsLeft<=0){
      clearInterval(examTimer)
      gradeExam()
    }
  },1000)
  startExamBtn.classList.add('hidden')
  submitExamBtn.classList.remove('hidden')
}

function clearExamState(){
  if(examTimer) clearInterval(examTimer)
  examTimer=null
  examQuestionsEl.innerHTML=''
  examResultEl.classList.add('hidden')
  startExamBtn.classList.remove('hidden')
  submitExamBtn.classList.add('hidden')
  saveExamResultBtn.classList.add('hidden')
}

function updateTimerDisplay(){
  const m = Math.floor(examSecondsLeft/60).toString().padStart(2,'0')
  const s = (examSecondsLeft%60).toString().padStart(2,'0')
  examTimerEl.textContent = `剩餘時間：${m}:${s}`
}

function generateExamQuestions(n){
  const pool = shuffle([...elements])
  const qs = pool.slice(0,n).map(el=>{
    const correct = el
    const choices = [correct.name]
    // pick 3 wrong names
    let i=0
    while(choices.length<4 && i<200){
      const cand = elements[Math.floor(Math.random()*elements.length)].name
      if(!choices.includes(cand)) choices.push(cand)
      i++
    }
    return {atomicNumber:correct.atomicNumber, symbol:correct.symbol, name:correct.name, choices:shuffle(choices)}
  })
  return qs
}

function renderExamQuestions(qs){
  examQuestionsEl.innerHTML=''
  qs.forEach((q, idx)=>{
    const div = document.createElement('div')
    div.className='q-item'
    const title = document.createElement('div')
    title.textContent = `${idx+1}. 元素符號：${q.symbol}（第 ${q.atomicNumber} 號）` 
    div.appendChild(title)
    q.choices.forEach((c,ci)=>{
      const id = `exam-q${idx}-c${ci}`
      const label = document.createElement('label')
      label.style.display='block'
      const radio = document.createElement('input')
      radio.type='radio'
      radio.name = `exam-q${idx}`
      radio.value = c
      radio.id = id
      label.appendChild(radio)
      label.append(' ' + c)
      div.appendChild(label)
    })
    examQuestionsEl.appendChild(div)
  })
}

function gradeExam(){
  if(examTimer) clearInterval(examTimer)
  let correct=0
  currentExam.forEach((q,idx)=>{
    const sel = document.querySelector(`input[name=exam-q${idx}]:checked`)
    if(sel && sel.value===q.name) correct++
  })
  const total = currentExam.length
  examResultEl.textContent = `得分：${correct} / ${total}`
  examResultEl.dataset.score = correct
  examResultEl.dataset.total = total
  examResultEl.classList.remove('hidden')
  saveExamResultBtn.classList.remove('hidden')
  submitExamBtn.classList.add('hidden')
}

// Precipitation table (solubility) feature
const precipBtn = document.getElementById('precipBtn')
const precipSection = document.getElementById('precip')
const precipTableEl = document.getElementById('precip-table')
const precipSearch = document.getElementById('precip-search')
const exitPrecipBtn = document.getElementById('exitPrecip')

// small solubility dataset (common rules)
const precipData = [
  {formula:'NaCl', cation:'Na+', anion:'Cl-', soluble:true, notes:'可溶'},
  {formula:'KNO3', cation:'K+', anion:'NO3-', soluble:true, notes:'硝酸鹽通常可溶'},
  {formula:'AgCl', cation:'Ag+', anion:'Cl-', soluble:false, notes:'氯化銀不溶'} ,
  {formula:'PbSO4', cation:'Pb2+', anion:'SO4 2-', soluble:false, notes:'硫酸鉛微溶'} ,
  {formula:'BaSO4', cation:'Ba2+', anion:'SO4 2-', soluble:false, notes:'硫酸鋇不溶'} ,
  {formula:'CaCO3', cation:'Ca2+', anion:'CO3 2-', soluble:false, notes:'碳酸鈣不溶於水'} ,
  {formula:'Na2CO3', cation:'Na+', anion:'CO3 2-', soluble:true, notes:'碳酸鹽（鹼金屬）可溶'}
]

precipBtn.addEventListener('click',()=>{
  precipSection.classList.remove('hidden')
  document.getElementById('table-container').style.display='none'
  renderPrecipTable(precipData)
})
exitPrecipBtn.addEventListener('click',()=>{
  precipSection.classList.add('hidden')
  document.getElementById('table-container').style.display='grid'
})

precipSearch.addEventListener('input',e=>{
  const q = e.target.value.trim().toLowerCase()
  const filtered = precipData.filter(item=>{
    return item.formula.toLowerCase().includes(q) || item.cation.toLowerCase().includes(q) || item.anion.toLowerCase().includes(q) || item.notes.toLowerCase().includes(q)
  })
  renderPrecipTable(filtered)
})

function renderPrecipTable(list){
  precipTableEl.innerHTML=''
  // header
  const header = document.createElement('div')
  header.className='precip-row'
  header.innerHTML = `<div class="precip-col"><strong>化學式</strong></div><div class="precip-col"><strong>陽離子</strong></div><div class="precip-col"><strong>陰離子</strong></div><div class="precip-col"><strong>可溶性</strong></div><div class="precip-col"><strong>備註</strong></div>`
  precipTableEl.appendChild(header)
  list.forEach(it=>{
    const row = document.createElement('div')
    row.className='precip-row'
    row.innerHTML = `<div class="precip-col">${it.formula}</div><div class="precip-col">${it.cation}</div><div class="precip-col">${it.anion}</div><div class="precip-col ${it.soluble? 'soluble':'insoluble'}">${it.soluble? '可溶':'不溶'}</div><div class="precip-col">${it.notes}</div>`
    precipTableEl.appendChild(row)
  })
}
>>>>>>> a47024d (Add exam and precipitation features; Apps Script placeholders)

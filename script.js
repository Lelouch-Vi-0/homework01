const DATA_URL = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json'
const GAS_URL = 'YOUR_GAS_WEBAPP_URL'
let elements = []

document.addEventListener('DOMContentLoaded', () => {
  // Get all DOM elements
  const container = document.getElementById('table-container')
  const searchInput = document.getElementById('search')
  const flashBtn = document.getElementById('flashBtn')
  const quizBtn = document.getElementById('quizBtn')
  const autoFillBtn = document.getElementById('autoFillBtn')
  const userNameInput = document.getElementById('userName')

  // Flashcard elements
  const flashSection = document.getElementById('flashcard')
  const cardFront = document.getElementById('card-front')
  const cardBack = document.getElementById('card-back')
  const prevBtn = document.getElementById('prev')
  const nextBtn = document.getElementById('next')
  const revealBtn = document.getElementById('reveal')
  const exitFlash = document.getElementById('exitFlash')
  const saveProgressBtn = document.getElementById('saveProgress')

  // Quiz elements
  const quizSection = document.getElementById('quiz')
  const quizArea = document.getElementById('quiz-area')
  const exitQuizBtn = document.getElementById('exitQuiz')

  // Exam elements
  const examBtn = document.getElementById('examBtn')
  const examSection = document.getElementById('exam')
  const startExamBtn = document.getElementById('startExam')
  const submitExamBtn = document.getElementById('submitExam')
  const exitExamBtn = document.getElementById('exitExam')
  const examQuestionsEl = document.getElementById('exam-questions')
  const examTimerEl = document.getElementById('exam-timer')
  const saveExamResultBtn = document.getElementById('saveExamResult')
  const examResultEl = document.getElementById('exam-result')

  // Precipitation elements
  const precipBtn = document.getElementById('precipBtn')
  const precipSection = document.getElementById('precip')
  const precipTableEl = document.getElementById('precip-table')
  const precipSearch = document.getElementById('precip-search')
  const exitPrecipBtn = document.getElementById('exitPrecip')

  // State variables
  let flashIndex = 0
  let examTimer = null
  let examSecondsLeft = 0
  let currentExam = []

  // Precipitation data
  const precipData = [
    {formula:'NaCl', cation:'Na+', anion:'Cl-', soluble:true, notes:'可溶'},
    {formula:'KNO3', cation:'K+', anion:'NO3-', soluble:true, notes:'硝酸鹽通常可溶'},
    {formula:'AgCl', cation:'Ag+', anion:'Cl-', soluble:false, notes:'氯化銀不溶'},
    {formula:'PbSO4', cation:'Pb2+', anion:'SO4 2-', soluble:false, notes:'硫酸鉛微溶'},
    {formula:'BaSO4', cation:'Ba2+', anion:'SO4 2-', soluble:false, notes:'硫酸鋇不溶'},
    {formula:'CaCO3', cation:'Ca2+', anion:'CO3 2-', soluble:false, notes:'碳酸鈣不溶於水'},
    {formula:'Na2CO3', cation:'Na+', anion:'CO3 2-', soluble:true, notes:'碳酸鹽（鹼金屬）可溶'}
  ]

  // Load elements from API
  fetch(DATA_URL).then(r=>r.json()).then(j=>{
    elements = j.elements.sort((a,b)=>a.atomicNumber-b.atomicNumber)
    renderTable()
  }).catch(e=>{container.textContent='無法載入元素資料，請檢查網路。'})

  // Utility function
  function shuffle(a){
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]]
    }
    return a
  }

  // Render periodic table
  function renderTable(){
    container.innerHTML = ''
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
        const atomicMass = el.atomicMass || el.atomic_mass ? Number(el.atomicMass || el.atomic_mass).toFixed(2) : '—'
        const category = el.category ? el.category.replace(/-/g, ' ') : 'Unknown'
        const phase = el.phase || '—'
        div.innerHTML = `
          <div class="el-header">
            <span class="el-number">${el.atomicNumber}</span>
            <span class="el-mass">${atomicMass}</span>
          </div>
          <div class="el-symbol">${el.symbol}</div>
          <div class="el-name">${el.name}</div>
          <div class="el-info">
            <span>${category}</span>
            <span>${phase}</span>
          </div>
        `
        div.title = `${el.name} (${el.symbol})`
        div.addEventListener('click',()=>openFlashcardByEl(el))
        container.appendChild(div)
      }
    }
  }

  // Search
  searchInput.addEventListener('input',e=>{
    const q = e.target.value.trim().toLowerCase()
    if(!q) return renderTable()
    const found = elements.filter(el=>el.symbol.toLowerCase().includes(q)||el.name.toLowerCase().includes(q))
    container.innerHTML=''
    found.forEach(el=>{
      const div=document.createElement('div')
      div.className='element'
      const atomicMass = el.atomicMass || el.atomic_mass ? Number(el.atomicMass || el.atomic_mass).toFixed(2) : '—'
      const category = el.category ? el.category.replace(/-/g, ' ') : 'Unknown'
      const phase = el.phase || '—'
      div.innerHTML = `
        <div class="el-header">
          <span class="el-number">${el.atomicNumber}</span>
          <span class="el-mass">${atomicMass}</span>
        </div>
        <div class="el-symbol">${el.symbol}</div>
        <div class="el-name">${el.name}</div>
        <div class="el-info">
          <span>${category}</span>
          <span>${phase}</span>
        </div>
      `
      div.addEventListener('click',()=>openFlashcardByEl(el))
      container.appendChild(div)
    })
  })

  // Flashcard functions
  function openFlashcardByEl(el){
    flashIndex = elements.findIndex(e=>e.atomicNumber===el.atomicNumber)
    showFlash()
  }

  function startFlashcards(){
    flashIndex = 0
    showFlash()
  }

  function showFlash(){
    flashSection.classList.remove('hidden')
    document.getElementById('table-container').style.display='none'
    const el = elements[flashIndex]
    const atomicMass = el.atomicMass || el.atomic_mass ? Number(el.atomicMass || el.atomic_mass).toFixed(2) : '—'
    const category = el.category ? el.category.replace(/-/g, ' ') : 'Unknown'
    const phase = el.phase || '—'
    const electrons = el.electronConfiguration || '—'
    const summary = el.summary ? el.summary : ''
    cardFront.innerHTML = `
      <div class="card-top">
        <div class="card-symbol">${el.symbol}</div>
        <div class="card-atomic">${el.atomicNumber}</div>
      </div>
      <div class="card-details">
        <div><span>名稱</span>${el.name}</div>
        <div><span>原子量</span>${atomicMass}</div>
        <div><span>類別</span>${category}</div>
        <div><span>相態</span>${phase}</div>
      </div>
    `
    cardBack.innerHTML = `
      <div class="card-back-title">${el.name} (${el.symbol})</div>
      <div class="card-details">
        <div><span>電子排布</span>${electrons}</div>
        <div><span>熔點</span>${el.melt ?? '—'}</div>
        <div><span>沸點</span>${el.boil ?? '—'}</div>
        <div><span>密度</span>${el.density ?? '—'}</div>
      </div>
      <div class="card-summary">${summary}</div>
    `
    cardBack.classList.add('hidden')
  }

  // Flashcard events
  flashBtn.addEventListener('click',()=>startFlashcards())
  autoFillBtn.addEventListener('click',()=>{
    if(!elements.length) return alert('元素資料尚未載入')
    const idx = Math.floor(Math.random()*elements.length)
    openFlashcardByEl(elements[idx])
  })

  revealBtn.addEventListener('click',()=>{cardBack.classList.toggle('hidden')})
  prevBtn.addEventListener('click',()=>{flashIndex=(flashIndex-1+elements.length)%elements.length;showFlash()})
  nextBtn.addEventListener('click',()=>{flashIndex=(flashIndex+1)%elements.length;showFlash()})
  exitFlash.addEventListener('click',()=>{flashSection.classList.add('hidden');document.getElementById('table-container').style.display='grid'})

  saveProgressBtn.addEventListener('click',()=>{
    const el = elements[flashIndex]
    const user = (userNameInput && userNameInput.value) ? userNameInput.value.trim() : '匿名'
    const payload = {timestamp: new Date().toISOString(), user, atomicNumber: el.atomicNumber, symbol: el.symbol, name: el.name}
    if(!GAS_URL || GAS_URL==='YOUR_GAS_WEBAPP_URL') return alert('請先在 script.js 設定 GAS_URL 為你的 Apps Script Web App URL')
    fetch(GAS_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(r=>r.json()).then(j=>{ if(j.success) alert('已儲存') ; else alert('儲存失敗') }).catch(e=>alert('儲存失敗：'+e.message))
  })

  // Quiz functions
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

  // Quiz events
  quizBtn.addEventListener('click',()=>startQuiz())
  exitQuizBtn.addEventListener('click',()=>{quizSection.classList.add('hidden');document.getElementById('table-container').style.display='grid'})

  // Exam functions
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

  // Exam events
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
    startExam(10, 600)
  })

  submitExamBtn.addEventListener('click',()=>{gradeExam()})
  
  saveExamResultBtn.addEventListener('click',()=>{
    const user = (userNameInput && userNameInput.value) ? userNameInput.value.trim() : '匿名'
    const payload = {type:'exam', user, score:examResultEl.dataset.score||'', total:examResultEl.dataset.total||'', timestamp:new Date().toISOString()}
    if(!GAS_URL || GAS_URL==='YOUR_GAS_WEBAPP_URL') return alert('請先在 script.js 設定 GAS_URL 為你的 Apps Script Web App URL')
    fetch(GAS_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(r=>r.json()).then(j=>{ if(j.success) alert('成績已儲存') ; else alert('儲存失敗') }).catch(e=>alert('儲存失敗：'+e.message))
  })

  // Precipitation functions
  function renderPrecipTable(list){
    precipTableEl.innerHTML=''
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

  // To Do List elements
  const todoBtn = document.getElementById('todoBtn')
  const todoSection = document.getElementById('todo')
  const todoInput = document.getElementById('todoInput')
  const addTodoBtn = document.getElementById('addTodoBtn')
  const todoListEl = document.getElementById('todoList')
  const clearTodosBtn = document.getElementById('clearTodos')
  const exitTodoBtn = document.getElementById('exitTodo')

  const TODO_KEY = 'homework01_todo_list'
  let todos = loadTodos()

  function loadTodos(){
    try { return JSON.parse(localStorage.getItem(TODO_KEY)) || [] } catch { return [] }
  }

  function saveTodos(){
    localStorage.setItem(TODO_KEY, JSON.stringify(todos))
  }

  function renderTodos(){
    todoListEl.innerHTML = ''
    if(!todos.length) {
      todoListEl.innerHTML = '<div class="todo-empty">目前尚無待辦事項</div>'
      return
    }
    todos.forEach(item=>{
      const row = document.createElement('div')
      row.className = 'todo-item' + (item.done ? ' completed' : '')

      const label = document.createElement('label')
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = item.done
      checkbox.addEventListener('change', ()=>{
        item.done = checkbox.checked
        saveTodos()
        renderTodos()
      })
      const text = document.createElement('span')
      text.textContent = item.text
      label.append(checkbox, text)

      const removeBtn = document.createElement('button')
      removeBtn.textContent = '刪除'
      removeBtn.addEventListener('click', ()=>{
        todos = todos.filter(todo => todo.id !== item.id)
        saveTodos()
        renderTodos()
      })

      row.append(label, removeBtn)
      todoListEl.appendChild(row)
    })
  }

  function addTodo(){
    const text = todoInput.value.trim()
    if(!text) return
    todos.push({id: Date.now() + Math.random(), text, done: false})
    todoInput.value = ''
    saveTodos()
    renderTodos()
  }

  function showTodoSection(){
    flashSection.classList.add('hidden')
    quizSection.classList.add('hidden')
    examSection.classList.add('hidden')
    precipSection.classList.add('hidden')
    todoSection.classList.remove('hidden')
    document.getElementById('table-container').style.display='none'
    renderTodos()
  }

  todoBtn.addEventListener('click', showTodoSection)
  exitTodoBtn.addEventListener('click', ()=>{
    todoSection.classList.add('hidden')
    document.getElementById('table-container').style.display='grid'
  })
  addTodoBtn.addEventListener('click', addTodo)
  todoInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') addTodo() })
  clearTodosBtn.addEventListener('click', ()=>{
    todos = []
    saveTodos()
    renderTodos()
  })

  // Precipitation events
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
})

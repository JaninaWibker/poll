import { createElement, insertChildAtIndex, array_insert, El } from './util.js'

(() => {
  window.addEventListener('DOMContentLoaded', () => {
  
    const titleEl =               document.getElementById('create-simple-title')
    const questionEl =            document.getElementById('create-simple-question')
    const answersParentEl =       document.getElementById('create-simple-answers')
    const multipleAnswersEl =     document.getElementById('create-simple-multiple-answers')
    const duplicateProectionEl =  document.getElementById('create-simple-duplicate-protection')
    const submitButtonEl =        document.getElementById('create-simple-create-poll-btn')

    const answerListEl = new AnswerListEl(2)

    answersParentEl.parentNode.replaceChild(answerListEl.render(), answersParentEl)

    answerListEl.mounted = true

    submitButtonEl.addEventListener('click', e => console.log(answerListEl.get_answers()))

  })

  const createAnswerElement = (id, answer = '') =>
    createElement('div', { class: 'create-simple-answer-wrapper' }, [
      createElement('input', { class: 'input', id: 'create-simple-answer-' + id,  type: 'text', placeholder: 'Answer', value: answer })
    ])
  
  class AnswerEl extends El {

    state = {
      id: null,
      answer: null
    }

    constructor(id, answer) {
      super(createAnswerElement(id, answer))
      this.id = id
      this.answer = answer
    }

    update(state) {
      if(state.id !== undefined && state.id !== this.state.id) {
        this.state.id = state.id
        this.el.children[0].id = 'create-simple-answer-' + this.id
      }

      if(state.answer !== undefined && state.answer !== this.state.answer) {
        this.state.answer = state.answer
        this.el.children[0].value = this.state.answer
      }
    }

  }

  class AnswerListEl extends El {

    state = {
      answers: []
    }

    onKeyPress(el, evt) {
      console.log('el:', el)
      if(evt.key === 'Enter') {
        if(el.id === this.answers.length-1) this.add(-1)

        console.log(this.answers)
        console.log(this.answers[el.id+1])

        this.answers[el.id+1].el.children[0].focus()
      }
    }

    constructor(count) {

      const answerEls = [...Array(count).keys()].map(id => new AnswerEl(id))

      answerEls.forEach(el => el.listen()
        .on('keypress', (_el, e) => this.onKeyPress(el, e))
        .finalize()
      )

      answerEls.forEach(el => el.mounted = true)

      super(createElement(
        'div',
        { class: 'create-simple-answers' },
        [createElement('span', {}, ['Answers']), ...answerEls]
      ))

      this.answers = answerEls
    }

    add(pos) {
      if(pos < 0) pos = this.answers.length+1+pos

      this.answers = array_insert(this.answers, pos, new AnswerEl(pos)
          .listen()
          .on('keypress', (el, e) => this.onKeyPress(el, e))
          .finalize()
      )
      this.answers.slice(pos+1).forEach(el => el.update({ id: el.state.id+1 }))

      console.log(this.answers)
      this.update()
    }

    remove(pos) {
      delete this.answers[pos]
      this.answers.splice(pos).forEach(el => el.update({id: el.state.id-1 }))

      this.update()
    }

    get_answers() {
      return this.answers.map(el => el.el.children[0].value).filter(str => str != "")
    }

    update(state) {
      
      if(state == undefined) { // update using this.state
        this.answers.forEach((el, i) => {
          if(el.mounted) {
            el.render() // rerender when already mounted
          } else {
            insertChildAtIndex(this.el, el.render(), i+1) // +1 because of "Answer"-text node
            el.mounted = true
          }
        })

        const to_be_removed = []
        let i = 0

        Array.from(this.el.children).slice(1).forEach(el => {
          if(!this.answers[i] || this.answers[i].el !== el) {
            to_be_removed.push(el)
          } else {
            i++
          }
        })

        to_be_removed.reverse().forEach(el => {
          this.el.removeChild(el)
        })

      } else { // update using state when needed
        if(state.answers !== undefined && state.answers !== this.state.answers) {
          console.log("should update the count of elements in the answer list now")
        }
      }
    }
  }

})()
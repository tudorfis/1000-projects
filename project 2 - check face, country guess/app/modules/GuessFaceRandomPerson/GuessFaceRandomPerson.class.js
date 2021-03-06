import countries from "/app/data/countries.js"
import { randomNumber } from "/app/utils/math.utils.js"
import { shuffleArray } from "/app/utils/array.utils.js"

export default class GuessFaceRandomPerson {
    constructor( inObj ) {
        this.guessFaceUi = inObj.guessFaceUi
        this.guessFaceApi = inObj.guessFaceApi

        this.randomPerson = {}
        this.randomPersonCountry = {}
        this.randomAnswers = []
    }

    loadRandomPerson() {
        return new Promise( resolve => {
            this.setRandomPerson()
            this.setRandomPersonCountry()
            this.setRandomAnswers()

            this.guessFaceUi.person = this.randomPerson
            this.guessFaceUi.answers = this.randomAnswers

            this.guessFaceUi.setFaceImage()
            this.guessFaceUi.setAnswersElements()

            resolve()
        })
    }

    setRandomPerson() {
        if ( !this.guessFaceApi.people.length ) return

        const length = this.guessFaceApi.people.length
        const index = randomNumber( length )

        this.randomPerson = this.guessFaceApi.people.splice( index, 1 )[ 0 ]

        if ( !this.randomPerson || !this.randomPerson.country || !this.randomPerson.image ) {
            return this.setRandomPerson()
        }
    }

    setRandomPersonCountry() {
        if ( !this.randomPerson || !countries ) return

        this.randomPersonCountry = countries.find( country => 
            country.name.toLowerCase() === this.randomPerson.country.toLowerCase())

        if ( !this.randomPersonCountry ) {
            this.setRandomPerson()
            return this.setRandomPersonCountry()
        }
    }

    setRandomAnswers() {
        this.randomAnswers = [
            { ...generateRandomCountry(), correct: false },
            { ...generateRandomCountry(), correct: false },
            { ...generateRandomCountry(), correct: false },
            { ...this.randomPersonCountry, correct: true }
        ]

        this.randomAnswers = shuffleArray( this.randomAnswers )

        function generateRandomCountry() {
            const length = countries.length
            const index = randomNumber( length )

            return countries[ index ]
        }
    }
}

import { useState, useEffect } from 'react'

function App() {
  const pokemonList = ["cacnea","ditto","eevee","gengar","mew","numel","omanyte","pikachu","scyther","togepi","torchic","zubat"]
  const [pokemons, setPokemons] = useState([])
  const [currScore, setCurrScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [selectedPokemon, setSelectedPokemon] = useState([])
  const [message, setMessage] = useState('')
  const handleScoreChange = (pokemon) => {
    if(selectedPokemon.includes(pokemon.id)){
      setMessage(`Oh no, you already selected ${pokemon.name.toUpperCase()}! Try again`)
      if(currScore > bestScore){
        setBestScore(currScore)
      }
      setCurrScore(0)
      setSelectedPokemon([])
    } else {
      if(currScore+1===12){
        setMessage("Great! You did it! Wanna try again?")
        setBestScore(12)
        setCurrScore(0)
        setSelectedPokemon([])
      } else {
        setMessage("Good, keep going!")
        setCurrScore(currScore+1)
        setSelectedPokemon([...selectedPokemon, pokemon.id])
      }
    }
  }


  useEffect(() => {
    let poks = [];
    const shuffledPokemons = pokemonList.map(value => ({ value, sort: Math.random() }))
                                                .sort((a, b) => a.sort - b.sort)
                                                .map(({ value }) => value)
    console.log(shuffledPokemons)
    const fetchPokemon = async (pokemon) => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`, {method: 'GET'}
      )
        .then((response) => response.json())
        .then((data) => {
          poks.push(data)
          if(poks.length === shuffledPokemons.length) {
            setPokemons(poks)
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    shuffledPokemons.forEach(async (pokemon) => {
      await fetchPokemon(pokemon)
    })
    return () => {
      setPokemons([]);
    }
  },[currScore]);

  return (
    <div>
      <div className='text-center m-5 flex flex-col gap-2'>
        <p className="text-4xl sm:text-6xl">MEMORY GAME</p>
        <div className='flex justify-center gap-4 m-2'>
          <p className="bg-white/20 border-1 border-white p-2 rounded-full">Current Score: {currScore}</p>
          <p className="bg-green-700 border-1 border-white p-2 rounded-full font-bold">Best Score: {bestScore}</p>
        </div>
        <p className="text-xl">Try to click on each Pokemon, but just once!</p>
        <p>{message}</p>
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 justify-center'>
        {pokemons.map((pokemon)=>{
          return <div key={pokemon.id} className="m-3">
            <img
              src={pokemon.sprites.front_default}
              alt="Pokemon"
              className="sm:min-w-35 border-2 rounded-full self-center justify-self-center bg-white cursor-pointer m-1"
              onClick={() => handleScoreChange(pokemon)}
            />
            <p className="text-center uppercase">{pokemon.name}</p>
          </div>
        })}
      </div>
    </div>
  )
}

export default App

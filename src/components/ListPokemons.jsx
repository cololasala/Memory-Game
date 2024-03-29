import axios from "axios";
import { useEffect, useState } from "react";
import interrogation from "../assets/images/interrogation.jpg";
import loser from "../assets/audios/loser.mp3";
import winner from "../assets/audios/winner.mp3";
import { Timer } from "./Timer";
import "./styles/ListPokemons.css";

export const ListPokemons = () => {
  const [listPokemons, setListPokemons] = useState([]);
  const [listPokemonsTwo, setListPokemonsTwo] = useState([]);
  const [loserAudio, setLoserAudio] = useState(new Audio(loser)); // para que ande el audio si o si se debe interactuar con la pagina (tocar al menos una vez, sino falla la activacion)
  const [winnerAudio, setWinnerAudio] = useState(new Audio(winner));

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    let id = 1;

    while (id < 16) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then(({ data }) => {
        setListPokemons((listPokemons) => [
          ...listPokemons,
          {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            isShowing: false,
            found: false,
          },
        ]);
        setListPokemons((listPokemons) => [
          ...listPokemons.sort(() => Math.random() - 0.5),
        ]);
        setListPokemonsTwo((listPokemonsTwo) => [
          ...listPokemonsTwo,
          {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            isShowing: false,
            found: false,
          },
        ]);
        setListPokemonsTwo((listPokemonsTwo) => [
          ...listPokemonsTwo.sort(() => Math.random() - 0.5),
        ]);
      });
      id += 1;
    }
  };

  const showImage = (id, list) => {
    /* Logica ver ya existen dos images con show true */
    if (checkShowedImages() !== 2) {
      if (list === 1) {
        setListPokemons(
          listPokemons.map((p) => {
            if (p.id === id) {
              return { ...p, isShowing: true };
            } else {
              return p;
            }
          })
        );
      } else {
        setListPokemonsTwo(
          listPokemonsTwo.map((p) => {
            if (p.id === id) {
              return { ...p, isShowing: true };
            } else {
              return p;
            }
          })
        );
      }
    }
  };

  useEffect(() => {
    if (checkShowedImages() === 2) {
      if (checkCoincidence()) {
        setTimeout(() => {
          setListPokemons(
            listPokemons.map((p) => {
              if (p.isShowing) {
                return { ...p, isShowing: false, found: true };
              } else {
                return p;
              }
            })
          );
          setListPokemonsTwo(
            listPokemonsTwo.map((p) => {
              if (p.isShowing) {
                return { ...p, isShowing: false, found: true };
              } else {
                return p;
              }
            })
          );
        }, 1000);
      } else {
        setTimeout(() => {
          setListPokemons(
            listPokemons.map((p) => {
              if (p.isShowing) {
                return { ...p, isShowing: false, found: false };
              } else {
                return p;
              }
            })
          );
          setListPokemonsTwo(
            listPokemonsTwo.map((p) => {
              if (p.isShowing) {
                return { ...p, isShowing: false, found: false };
              } else {
                return p;
              }
            })
          );
        }, 1000);
      }
    }
  }, [listPokemons, listPokemonsTwo]);

  const checkCoincidence = () => {
    /* Solo chequeo si tengo seleccionado uno de cada lista, ya que nunca tendre 2 pokemones repetidos en la misma lista */
    if (
      listPokemons.some((p) => p.isShowing) &&
      listPokemonsTwo.some((p) => p.isShowing)
    ) {
      return (
        listPokemons.filter((p) => p.isShowing)[0].id ===
        listPokemonsTwo.filter((p) => p.isShowing)[0].id
      );
    }
  };

  const checkShowedImages = () => {
    return (
      listPokemons.filter((p) => p.isShowing).length +
      listPokemonsTwo.filter((p) => p.isShowing).length
    );
  };

  const checkFounded = () => {
    return (
      listPokemons.filter((p) => p.found).length +
      listPokemonsTwo.filter((p) => p.found).length
    );
  };

  const blockList = () => {
    loserAudio.play();
    alert("Tu tiempo se acabo, volve a intentarlo!");
    resetGame();
  };

  const resetGame = () => {
    setTimeout(() => {
      setListPokemons([]);
      setListPokemonsTwo([]);
      initData();
    });
  };

  const playAudioWinner = () => {
    winnerAudio.play();
    return (
      <div className="win-container">
        <h1>Ganaste!, bien ahi guachin :D</h1>
        <button className="play-button" onClick={() => resetGame()}>
          Volver a jugar
        </button>
      </div>
    );
  };

  return (
    <>
      {listPokemons.length > 0 && listPokemonsTwo.length > 0 && (
        <>
          {checkFounded() / 2 === 15 ? (
            playAudioWinner()
          ) : (
            <Timer timeout={() => blockList()} />
          )}

          <h3>
            Parejas encontradas: {checkFounded() > 0 ? checkFounded() / 2 : 0}
          </h3>

          <table className="center">
            <tbody>
              <tr>
                {listPokemons.slice(0, 4).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 1)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
                {listPokemonsTwo.slice(5, 6).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 2)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                {listPokemonsTwo.slice(6, 10).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 2)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
                {listPokemons.slice(4, 5).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 1)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                {listPokemonsTwo.slice(0, 3).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 2)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
                {listPokemons.slice(10, 12).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 1)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
              </tr>
              {/* MITAD */}
              <tr>
                {listPokemons.slice(12, 15).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 1)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
                {listPokemonsTwo.slice(3, 5).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 2)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                {listPokemons.slice(5, 10).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 1)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                {listPokemonsTwo.slice(10, 15).map((p) => {
                  return (
                    <td key={p.id}>
                      {p.isShowing === false && p.found === false && (
                        <img
                          src={interrogation}
                          alt="interrogation"
                          className="img-interrogation"
                          onClick={() => showImage(p.id, 2)}
                        />
                      )}
                      {((p.isShowing && p.found === false) || p.found) && (
                        <img src={p.image} title={p.name} alt={p.name} />
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

import { useState, useEffect } from 'react'
import { Wheel } from 'react-custom-roulette'
import './App.css'

function App() {
  const [opcion, setOpcion] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [resultado, setResultado] = useState('');
  const [mustSpin, setMustSpin] = useState(false);
  const [premioIndex, setPremioIndex] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [motivo, setMotivo] = useState('');

  const datosRuleta = opciones.map((op) => ({ option: op }));

  useEffect(() => {
    const guardadas = localStorage.getItem('opcionesRuleta');
    if (guardadas) setOpciones(JSON.parse(guardadas));
    const ultimoResultado = localStorage.getItem('resultadoRuleta');
    if (ultimoResultado) setResultado(ultimoResultado);
  }, []);

  useEffect(() => {
    localStorage.setItem('opcionesRuleta', JSON.stringify(opciones));
  }, [opciones]);

  useEffect(() => {
    if (resultado) {
      localStorage.setItem('resultadoRuleta', resultado);
    }
  }, [resultado]);

  useEffect(() => {
    if (temaOscuro) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [temaOscuro]);

  const agregarOpcion = () => {
    const texto = opcion.trim();
    if (texto === '') {
      setMensaje('No puedes añadir una opción vacía.');
      return;
    }
    if (opciones.includes(texto)) {
      setMensaje('Esa opción ya existe.');
      return;
    }
    setOpciones([...opciones, texto]);
    setOpcion('');
    setMensaje('');
  };

  const eliminarOpcion = (index) => {
    const nuevasOpciones = opciones.filter((_, i) => i !== index);
    setOpciones(nuevasOpciones);
    setMensaje('');
  };

  const girarRuleta = () => {
    if (opciones.length < 2 || mustSpin) {
      setMensaje('Agrega al menos 2 opciones para girar la ruleta.');
      return;
    }
    const indexAleatorio = Math.floor(Math.random() * opciones.length);
    setPremioIndex(indexAleatorio);
    setMustSpin(true);
    setResultado('');
    setMensaje('');
  };

  const reiniciarRuleta = () => {
    setOpciones([]);
    setResultado('');
    setMensaje('');
    setMotivo('');
    localStorage.removeItem('opcionesRuleta');
    localStorage.removeItem('resultadoRuleta');
  };

  return (
    <div className={`App${temaOscuro ? ' dark' : ''}`}>
      <button
        className="tema-toggle"
        onClick={() => setTemaOscuro(t => !t)}
        aria-label="Cambiar tema"
      >
        {temaOscuro ? '🌙 Modo Claro' : '🌞 Modo Oscuro'}
      </button>
      <h1>🕊️ Gambling 🤑</h1>
      <div className="layout">
        {/* Panel izquierdo */}
        <div className="panel izquierdo">
          <div className="input-group">
            <input
              type="text"
              value={opcion}
              onChange={(e) => setOpcion(e.target.value)}
              placeholder="Escribe una opción"
              onKeyDown={e => e.key === 'Enter' && agregarOpcion()}
            />
            <button className="agregar" onClick={agregarOpcion}>Añadir</button>
          </div>
          {mensaje && <div className="mensaje">{mensaje}</div>}
          <ul className="lista-opciones">
            {opciones.map((op, index) => (
              <li key={index} className="opcion-item">
                <span>{op}</span>
                <button
                  className="eliminar"
                  onClick={() => eliminarOpcion(index)}
                  title="Eliminar"
                  disabled={mustSpin}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
          <div className="motivo-group">
            <input
              type="text"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="¿Por qué giras la ruleta? (opcional)"
              disabled={mustSpin}
            />
          </div>
        </div>
        {/* Panel central */}
        <div className="panel centro">
          <div className="wheel-container">
            {opciones.length >= 2 ? (
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={premioIndex}
                data={datosRuleta}
                backgroundColors={['#FF7F50', '#87CEFA', '#FFD700', '#90EE90']}
                textColors={['#222']}
                fontSize={18}
                outerBorderColor="#333"
                outerBorderWidth={6}
                radiusLineColor="#fff"
                radiusLineWidth={2}
                onStopSpinning={() => {
                  setMustSpin(false);
                  setResultado(opciones[premioIndex]);
                }}
              />
            ) : (
              <div className="ruleta-placeholder">
                <p>Agrega al menos 2 opciones para mostrar la ruleta.</p>
              </div>
            )}
          </div>
        </div>
        {/* Panel derecho */}
        <div className="panel derecho">
          <div className="botones-ruleta">
            <button
              className="girar"
              onClick={girarRuleta}
              disabled={mustSpin || opciones.length < 2}
            >
              {mustSpin ? 'Girando...' : 'Girar Ruleta'}
            </button>
            <button
              className="reiniciar"
              onClick={reiniciarRuleta}
              disabled={mustSpin}
            >
              Reiniciar Ruleta
            </button>
          </div>
          {resultado && !mustSpin && (
            <div className="resultado animar-resultado">
              🎉 <span>Resultado:</span> <b>{resultado}</b>
              {motivo && (
                <div className="motivo-resultado">
                  <span>Motivo: <i>{motivo}</i></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

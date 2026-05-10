function mission(text, validate) {
  return { text, validate }
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function textIncludes(value, query) {
  return normalizeText(value).includes(normalizeText(query))
}

function styleValue(element, property) {
  if (!element) return ''
  const inlineValue = element.style?.getPropertyValue(property) || ''
  return inlineValue.toLowerCase().trim()
}

function styleMatchesGreen(value) {
  const normalized = String(value || '').toLowerCase().replace(/\s+/g, '')
  return normalized === 'green' || normalized === '#008000' || normalized === 'rgb(0,128,0)'
}

function styleMatchesTitleDefault(value) {
  const normalized = String(value || '').toLowerCase().replace(/\s+/g, '')
  return normalized === '#d94f70' || normalized === 'rgb(217,79,112)'
}

function styleMatchesYellowBoxDefault(value) {
  const normalized = String(value || '').toLowerCase().replace(/\s+/g, '')
  return normalized === '#f7c94c' || normalized === 'rgb(247,201,76)'
}

function numberFromStyle(value) {
  const match = String(value || '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : 0
}

function findElementByText(document, selector, text) {
  return Array.from(document.querySelectorAll(selector)).find((element) => {
    return textIncludes(element.textContent, text)
  })
}

function findLabelOrField(document, text) {
  const selectors = ['label', 'input', 'textarea', 'select']
  return selectors.some((selector) => {
    return Array.from(document.querySelectorAll(selector)).some((element) => {
      return [element.textContent, element.id, element.name, element.placeholder].some((value) => {
        return textIncludes(value, text)
      })
    })
  })
}

const levels = [
  {
    title: 'Etiquetas Basicas de HTML5',
    subtitle: 'Definicion y uso simple',
    description: `
      <p>Hoy vamos a construir una tarjeta de sushi usando etiquetas basicas de HTML5.</p>
      <p>En esta leccion vas a ver y practicar:</p>
      <ul>
        li>Etiquetas basicas como <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code> y <code>&lt;div&gt;</code>.</li>
        <li>Formato de texto con <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code> y <code>&lt;mark&gt;</code>.</li>
        <li>Imagenes con <code>&lt;img&gt;</code>.</li>
        <li>Audio con <code>&lt;audio&gt;</code>.</li>
        <li>Video con <code>&lt;video&gt;</code>.</li>
        <li>Colores usando el atributo <code>style</code>.</li>
      </ul>
      <p>Prueba cambiar los textos, colores y tamanos para personalizar tu mini restaurante de sushi.</p>
    `,
    hint: 'Empieza por cambiar el titulo, luego modifica colores y por ultimo prueba a agregar otro parrafo o una segunda imagen.',
    missions: [
      mission('Quita la negrita de la palabra Salmon.', ({ document }) => {
        const hasSalmonText = textIncludes(document.body.textContent, 'salmon')
        const salmonInStrong = Array.from(document.querySelectorAll('strong')).some((element) => {
          return textIncludes(element.textContent, 'salmon')
        })
        return hasSalmonText && !salmonInStrong
      }),
      mission('Subraya la palabra atun usando una etiqueta HTML.', ({ document }) => {
        return Array.from(document.querySelectorAll('u')).some((element) => {
          return textIncludes(element.textContent, 'atun')
        })
      }),
      mission('Cambia a verde el texto que dice "Este texto es azul".', ({ document }) => {
        const target = findElementByText(document, 'p, span, div', 'Este texto es azul')
        return styleMatchesGreen(styleValue(target, 'color'))
      }),
      mission('Cambia el color del titulo "Mi barra de sushi".', ({ document }) => {
        const title = findElementByText(document, 'h1, h2, h3', 'Mi barra de sushi')
        const titleColor = styleValue(title, 'color')
        return Boolean(titleColor) && !styleMatchesTitleDefault(titleColor)
      }),
      mission('Haz mas grande la caja amarilla o cambiale el color de fondo.', ({ document }) => {
        return Array.from(document.querySelectorAll('div')).some((element) => {
          const width = numberFromStyle(styleValue(element, 'width'))
          const height = numberFromStyle(styleValue(element, 'height'))
          const background = styleValue(element, 'background') || styleValue(element, 'background-color')
          return width > 160 || height > 70 || (background && !styleMatchesYellowBoxDefault(background))
        })
      }),
    ],
    initialCode: `<section style="font-family: Arial, sans-serif; padding: 24px; border-radius: 20px; background: #fff7ed;">
  <h1 style="color: #d94f70;">Mi barra de sushi</h1>
  <p>HTML usa etiquetas para decirle al navegador que debe mostrar.</p>

  <h2>Texto con formato</h2>
  <p>
    <strong>Salmon</strong> se ve fuerte,
    <em>atun</em> se ve inclinado y
    <mark>esto esta resaltado</mark>.
  </p>

  <h2>Imagen</h2>
  <img src="svg/mascot.svg" alt="Mascota sushi" width="140">

  <h2>Audio</h2>
  <audio controls></audio>

  <h2>Video</h2>
  <video controls width="260"></video>

  <h2>Colores</h2>
  <p style="color: #2563eb;">Este texto es azul.</p>
  <div style="width: 160px; height: 70px; border-radius: 16px; background: #f7c94c;"></div>
</section>`,
  },
  {
    title: 'Etiquetas Avanzadas',
    subtitle: 'Listas, tablas, maquetacion, carpetas y enlaces',
    description: `
      <p>Ahora tu pagina de sushi va a crecer y se vera mas completa.</p>
      <p>En esta leccion vas a practicar:</p>
      <ul>
        <li>Listas con <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code> y <code>&lt;li&gt;</code>.</li>
        <li>Tablas con <code>&lt;table&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code> y <code>&lt;td&gt;</code>.</li>
        <li>Maquetacion con <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;aside&gt;</code> y <code>&lt;footer&gt;</code>.</li>
        <li>Rutas de carpetas como <code>./</code>, <code>../</code> y nombres de carpetas dentro de <code>href</code> o <code>src</code>.</li>
        <li>Enlaces con <code>&lt;a&gt;</code> para moverte entre paginas o abrir archivos.</li>
      </ul>
      <p>La idea es entender que cada etiqueta tiene un trabajo, igual que cada pieza de sushi en una caja.</p>
    `,
    hint: 'Prueba cambiar una lista por una tabla, agrega un enlace nuevo o modifica una ruta como ./svg/mascot.svg para ver que las carpetas tambien importan.',
    missions: [
      mission('Agrega una nueva seccion que muestre resenas de usuarios.', ({ document }) => {
        return Array.from(document.querySelectorAll('section, article')).some((element) => {
          return textIncludes(element.textContent, 'resenas') || textIncludes(element.textContent, 'usuarios')
        })
      }),
      mission('Anade un nuevo elemento a la lista de pedidos.', ({ document }) => {
        const ordersHeading = findElementByText(document, 'h1, h2, h3', 'Lista de pedidos')
        const ordersList = ordersHeading?.nextElementSibling
        return ordersList?.matches('ul') ? ordersList.querySelectorAll('li').length > 3 : false
      }),
      mission('Agrega una fila nueva a la tabla del menu.', ({ document }) => {
        const table = document.querySelector('table')
        return table ? table.querySelectorAll('tr').length > 3 : false
      }),
      mission('Crea un enlace nuevo dentro de nav que diga "Promociones".', ({ document }) => {
        return Array.from(document.querySelectorAll('nav a')).some((element) => {
          return textIncludes(element.textContent, 'promociones')
        })
      }),
      mission('Agrega un ejemplo mas de ruta dentro de la lista de rutas y carpetas.', ({ document }) => {
        const routesHeading = findElementByText(document, 'h1, h2, h3', 'Rutas y carpetas')
        const routesList = routesHeading?.parentElement?.querySelector('ul')
        return routesList ? routesList.querySelectorAll('li').length > 3 : false
      }),
    ],
    initialCode: `<header style="padding: 18px; border-radius: 18px; background: #fde68a;">
  <h1>Mapa del restaurante sushi</h1>
  <nav>
    <a href="./index.html">Inicio</a>
    <a href="./svg/mascot.svg">Mascota</a>
    <a href="./favicon/favicon-32x32.png">Icono</a>
  </nav>
</header>

<main style="margin-top: 16px; display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
  <section style="padding: 18px; border-radius: 18px; background: #ecfccb;">
    <h2>Lista de pedidos</h2>
    <ul>
      <li>Roll de salmon</li>
      <li>Temaki de atun</li>
      <li>Bolitas de arroz</li>
    </ul>

    <h2>Pasos del chef</h2>
    <ol>
      <li>Lavar las manos</li>
      <li>Preparar los ingredientes</li>
      <li>Servir en una bandeja bonita</li>
    </ol>

    <h2>Tabla del menu</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="text-align: left; border-bottom: 2px solid #4b5563;">Sushi</th>
        <th style="text-align: left; border-bottom: 2px solid #4b5563;">Precio</th>
      </tr>
      <tr>
        <td>Salmon</td>
        <td>$5</td>
      </tr>
      <tr>
        <td>Camaron</td>
        <td>$4</td>
      </tr>
    </table>
  </section>

  <aside style="padding: 18px; border-radius: 18px; background: #dbeafe;">
    <h2>Rutas y carpetas</h2>
    <p><strong>./</strong> significa "desde esta carpeta".</p>
    <p><strong>../</strong> significa "sube una carpeta".</p>
    <img src="./svg/mascot.svg" alt="Mascota del restaurante" width="120">
    <p>Ejemplos de rutas:</p>
    <ul>
      <li><code>./svg/mascot.svg</code></li>
      <li><code>./pages/menu.html</code></li>
      <li><code>../index.html</code></li>
    </ul>
  </aside>
</main>

<footer style="margin-top: 16px; padding: 18px; border-radius: 18px; background: #fecdd3;">
  Las etiquetas avanzadas ayudan a ordenar una web grande sin perderse.
</footer>`,
  },
  {
    title: 'Formularios en HTML5',
    subtitle: 'Formularios, seleccion y envio de datos',
    description: `
      <p>Los formularios sirven para escribir informacion, elegir opciones y enviar datos.</p>
      <p>En esta leccion vas a practicar:</p>
      <ul>
        <li><code>&lt;form&gt;</code> para reunir todos los datos en un solo lugar.</li>
        <li><code>&lt;label&gt;</code> para poner nombre a cada campo.</li>
        <li>Cajas de texto con <code>&lt;input&gt;</code> como <code>text</code>, <code>email</code> y <code>number</code>.</li>
        <li>Objetos de seleccion con <code>&lt;select&gt;</code>, <code>&lt;option&gt;</code>, <code>radio</code> y <code>checkbox</code>.</li>
        <li><code>&lt;textarea&gt;</code> para mensajes o notas largas.</li>
        <li><code>&lt;button&gt;</code> y el tipo <code>submit</code> para enviar datos.</li>
        <li>Atributos como <code>action</code> y <code>method</code> para indicar a donde viajan los datos.</li>
      </ul>
      <p>Puedes imaginar que estas creando un formulario para tomar pedidos en un restaurante de sushi.</p>
    `,
    hint: 'Fijate en como cada <label> explica una caja, y como el boton con type="submit" representa el envio de datos del formulario.',
    missions: [
      mission('Agrega un nuevo boton que diga "Guardar borrador".', ({ document }) => {
        return Array.from(document.querySelectorAll('button')).some((element) => {
          return textIncludes(element.textContent, 'Guardar borrador')
        })
      }),
      mission('Anade un campo nuevo para escribir el telefono.', ({ document }) => {
        return findLabelOrField(document, 'telefono')
      }),
      mission('Agrega una nueva opcion dentro del select de sushi.', ({ document }) => {
        const select = document.querySelector('select')
        return select ? select.querySelectorAll('option').length > 3 : false
      }),
      mission('Crea una casilla nueva para pedir jengibre extra.', ({ document }) => {
        return Array.from(document.querySelectorAll('input[type="checkbox"], label')).some((element) => {
          return textIncludes(element.textContent, 'jengibre') || textIncludes(element.value, 'jengibre')
        })
      }),
      mission('Agrega una nueva caja de texto para escribir la direccion de entrega.', ({ document }) => {
        return findLabelOrField(document, 'direccion')
      }),
    ],
    initialCode: `<form action="/enviar-pedido" method="post" style="display: grid; gap: 14px; max-width: 460px; padding: 24px; border-radius: 20px; background: #f5f3ff;">
  <h1>Pedido de sushi</h1>

  <label for="nombre">Tu nombre</label>
  <input id="nombre" type="text" placeholder="Escribe tu nombre">

  <label for="correo">Tu correo</label>
  <input id="correo" type="email" placeholder="hola@correo.com">

  <label for="cantidad">Cuantas piezas quieres</label>
  <input id="cantidad" type="number" min="1" max="30" placeholder="12">

  <label for="sushi">Tu sushi favorito</label>
  <select id="sushi" name="sushi">
    <option>Salmon</option>
    <option>Atun</option>
    <option>Camaron</option>
  </select>

  <p>Elige el tamano del pedido</p>
  <label>
    <input type="radio" name="tamano" value="pequeno">
    Pequeno
  </label>
  <label>
    <input type="radio" name="tamano" value="mediano">
    Mediano
  </label>
  <label>
    <input type="radio" name="tamano" value="grande">
    Grande
  </label>

  <p>Extras para el pedido</p>
  <label>
    <input type="checkbox" name="extras" value="palillos">
    Incluir palillos
  </label>
  <label>
    <input type="checkbox" name="extras" value="salsa">
    Incluir salsa extra
  </label>

  <label for="mensaje">Notas para el chef</label>
  <textarea id="mensaje" rows="4" placeholder="Sin cebolla, por favor"></textarea>

  <button type="submit">Enviar datos</button>
</form>`,
  },
]

levels.forEach((level, index) => {
  level.id = index + 1
})

export default levels

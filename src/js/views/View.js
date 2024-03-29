import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    // Now comparing the newElements with curElements
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // updating the text content
      // if (
      //   !newEl.isEqualNode(curEl) &&
      //   newEl.firstChild.nodeValue?.trim() !== ''
      // ) {
      //   curEl.textContent = newEl.textContent;
      // }

      // Check if newEl has a first child and if it's not null
      if (newEl.firstChild && newEl.firstChild.nodeValue) {
        const newElNodeValue = newEl.firstChild.nodeValue.trim();
        const curElNodeValue = curEl.firstChild.nodeValue.trim();

        // Update text content if not equal
        if (!newEl.isEqualNode(curEl) && newElNodeValue !== curElNodeValue) {
          curEl.textContent = newElNodeValue;
        }
      }

      // Update changed data attribute
      if (!newEl.isEqualNode(curEl)) {
        // console.log('newEL Attributes', Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
        <svg>
            <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
            <svg>
                <use href="${icons}.svg#icon-smile"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

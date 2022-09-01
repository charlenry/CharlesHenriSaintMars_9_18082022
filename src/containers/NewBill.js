import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleFormValidation)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  /* Ajout d'un contrôle de validation du formulaire */
  handleFormValidation = (e) => {
    const form = this.document.querySelector(".needs-validation");
  
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }
    form.classList.add("was-validated");
  
    if (form.checkValidity()) {
      this.handleSubmit(e);
    }
  }

  handleChangeFile = e => {
    e.preventDefault()
    const patternFileExt = /(\.jpg)|(jpeg)|(\.png)|(\.gif)/;
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0];
    const $file = this.document.querySelector(`input[data-testid="file"]`);
    const fileExtension = file.name.substr(-4);
    const patternResult = patternFileExt.test(fileExtension);
    const form = this.document.querySelector(".needs-validation");

    /* Ajout du contrôle de l'extension du fichier de justificatif */
    if(patternResult === true) {
      const filePath = e.target.value.split(/\\/g);
      const fileName = filePath[filePath.length-1];
      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;
      formData.append('file', file);
      formData.append('email', email);

      if (confirm(`Confirmez-vous le choix du format de ce justificatif ci-dessous ?\n  "${fileName}"\n\n Aussi, assurez-vous d'avoir rempli tous les champs obligatoires.`) && form.checkValidity()) {
        this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true
          }
        })
        .then(({fileUrl, key}) => {
          console.log(fileUrl)
          this.billId = key
          this.fileUrl = fileUrl
          this.fileName = fileName
        }).catch(error => console.error(error))
      } else {
        $file.value = '';
      }
    } else {
      $file.value = '';
      alert("Veuillez sélectionner un fichier avec l'une des extensions suivantes\n.jpg, .jpeg, .png, .gif");
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}

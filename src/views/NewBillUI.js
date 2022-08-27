import VerticalLayout from "./VerticalLayout.js";

export default () => {

  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half form-group">
                    <label for="expense-type" class="bold-label">Type de dépense <sup>*</sup></label>
                      <select required class="form-control blue-border" id="expense-type" data-testid="expense-type">
                        <option>Transports</option>
                        <option>Restaurants et bars</option>
                        <option>Hôtel et logement</option>
                        <option>Services en ligne</option>
                        <option>IT et électronique</option>
                        <option>Equipement et matériel</option>
                        <option>Fournitures de bureau</option>
                      </select>
                  </div>
                  <div class="col-half form-group">
                    <label for="expense-name" class="bold-label">Nom de la dépense <sup>*</sup></label>
                    <input type="text" class="form-control blue-border" id="expense-name" data-testid="expense-name" placeholder="Vol Paris Londres" required />
                    <div class="invalid-feedback">Veuillez saisir le nom de la dépense</div>
                    <div class="valid-feedback">C'est bon !</div>
                  </div>
                  <div class="col-half form-group">
                    <label for="datepicker" class="bold-label">Date <sup>*</sup></label>
                    <input required type="date" class="form-control blue-border" id="datepicker" data-testid="datepicker" />
                    <div class="invalid-feedback">Veuillez saisir la date</div>
                    <div class="valid-feedback">C'est bon !</div>
                  </div>
                  <div class="col-half form-group">
                    <label for="amount" class="bold-label">Montant TTC <sup>*</sup></label>
                    <input required type="number" class="form-control blue-border input-icon input-icon-right" id="amount" data-testid="amount" placeholder="348" />
                    <div class="invalid-feedback">Veuillez saisir le montant TTC</div>
                    <div class="valid-feedback">C'est bon !</div>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col form-group"> 
                      <label for="vat" class="bold-label">TVA</label>
                      <input type="number" class="form-control blue-border" id="vat" data-testid="vat" placeholder="70" />
                    </div>
                    <div class="flex-col form-group">
                      <label for="pct" class="bold-label">% TVA <sup>*</sup></label>
                      <input required type="number" class="form-control blue-border" id="pct" data-testid="pct" placeholder="20" />
                      <div class="invalid-feedback">Veuillez saisir le pourcentage de la TVA</div>
                      <div class="valid-feedback">C'est bon !</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half form-group">
                    <label for="commentary" class="bold-label">Commentaire</label>
                    <textarea class="form-control blue-border" id="commentary" data-testid="commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half form-group">
                    <label for="file" class="bold-label">Justificatif <sup>*</sup></label>
                    <input required type="file" class="form-control blue-border" id="file" data-testid="file" />
                    <div class="invalid-feedback">Veuillez saisir un justificatif au format jpg ou jpeg ou png ou gif</div>
                    <div class="valid-feedback">C'est bon !</div>
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};

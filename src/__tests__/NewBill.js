/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockedBills from "../__mocks__/store.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { formatDate } from "../app/format.js";
import router from "../app/Router.js";
import store from "../app/Store.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then icon-mail in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      //to-do write assertion
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      //to-do write expect expression
      expect(mailIcon).toHaveAttribute("class", "active-icon");
    });

    test("Then the title -Envoyer une note de frais- should be rendered", () => {
      document.body.innerHTML = NewBillUI();
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });

    test("Then new bill form should be rendered with 9 fields", () => {
      document.body.innerHTML = NewBillUI();
      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill).toBeTruthy;
      expect(formNewBill.length).toEqual(9);
    });

    describe("When I click on the button -Envoyer- with an empty form", () => {
      test("Then the form should still be rendered", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI({});
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockedBills,
          localStorage: window.localStorage,
        });

        const btnSend = document.getElementById('btn-send-bill');
        const handleClickSend = jest.fn(newBill.handleFormValidation);
        btnSend.addEventListener("click", handleClickSend);
        userEvent.click(btnSend);
        expect(screen.getByTestId("form-new-bill")).toBeTruthy;
      });
    });

    describe("I upload a non-image file", () => {
      test("Then the error message should be display", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI({});
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockedBills,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("change", handleChangeFile);
        const errorAlertSpy = jest.spyOn(window,'alert').mockImplementation();
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })]
            }
        });
        
        expect(handleChangeFile).toBeCalled();
        expect(inputFile.files[0].name).toBe("sample.txt");
        expect(errorAlertSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("I upload an acceptable image file", () => {
      test("Then the name of the file should be displayed in the -Justificatif- input", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI({});
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockedBills,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("change", handleChangeFile);
        const confirmChoiceSpy = jest.spyOn(window,'confirm').mockImplementation(jest.fn(() => true));
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["sample.jpg"], "sample.jpg", { type: "image/jpg" })]
            }
        });
        
        expect(handleChangeFile).toBeCalled();
        expect(confirmChoiceSpy).toHaveBeenCalledTimes(1);
        expect(inputFile.files[0].name).toBe("sample.jpg");
      });
    });

    /* test d'intégration POST new bill */
    describe("I submit a valid bill form", () => {
      test('then a bill is created', async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = NewBillUI({});

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockedBills,
          localStorage: window.localStorage,
        });

        const submit = screen.getByTestId('form-new-bill');

        const validBill = {
          name: "Abonnement Cloud",
          date: "2022-08-30",
          type: "Services en ligne",
          amount: 240,
          pct: 20,
          vat: "40",
          commentary: '',
          fileName: "sample.jpg",
          fileUrl: "https://test.storage.tld/sample.jpg"
        }

        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        document.querySelector(`input[data-testid="expense-name"]`).value = validBill.name;
        document.querySelector(`input[data-testid="datepicker"]`).value = validBill.date;
        document.querySelector(`select[data-testid="expense-type"]`).value = validBill.type;
        document.querySelector(`input[data-testid="amount"]`).value = validBill.amount;
        document.querySelector(`input[data-testid="vat"]`).value = validBill.vat;
        document.querySelector(`input[data-testid="pct"]`).value = validBill.pct;
        document.querySelector(`textarea[data-testid="commentary"]`).value = validBill.commentary;
        newBill.fileUrl = validBill.fileUrl;
        newBill.fileName = validBill.fileName;
        submit.addEventListener('click', handleSubmit);
        fireEvent.click(submit);
        expect(handleSubmit).toHaveBeenCalled();
        expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
      });
    });

  });
});

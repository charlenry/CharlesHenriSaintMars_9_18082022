/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockedBills from "../__mocks__/store.js";
import mockedBillsWithErrors from "../__mocks__/store-with-errors";
import { bills } from "../fixtures/bills.js";
import { billsWithErrors } from "../fixtures/bills-with-errors.js";
import router from "../app/Router.js";
import store from "../app/Store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then icon-window in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toHaveAttribute("class", "active-icon");
    });

    test("Then bills should be ordered from earliest to latest", async () => {
      let IdsOfBillsSortedFromFixtures = [];
      let IdsOfBillsSortedFromGetBills = [];

      // Tri descendant basé sur les données de fixtures/bills.js
      const billsSortedFromFixtures = Array.from(bills).sort((a, b) => {
        let x = a.date;
        let y = b.date;
        if (x < y) {
          return 1;
        }
        if (x > y) {
          return -1;
        }
        return 0;
      });

      for (let bill of billsSortedFromFixtures) {
        IdsOfBillsSortedFromFixtures.push(bill.id);
      }

      // Tri descendant de la methode getBills() basé sur les données de __mocks__/store.js
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
      window.onNavigate(ROUTES_PATH.Bills);

      const sampleBills = new Bills({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage,
      });
      const billsSortedFromGetBills = await sampleBills.getBills().then((data) => {
        const dataResult = [...data];
        return dataResult;
      });

      for (let bill of billsSortedFromGetBills) {
        IdsOfBillsSortedFromGetBills.push(bill.id);
      }

      expect(IdsOfBillsSortedFromGetBills).toEqual(IdsOfBillsSortedFromFixtures);

      /*** Solution sans passer par la methode getBills() ***/
      // document.body.innerHTML = BillsUI({ data: bills });
      // const datesAlreadySorted = ['2004-04-04', '2003-03-03', '2002-02-02', '2001-01-01'];
      // const dates = screen
      //   .getAllByText(
      //     /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
      //   )
      //   .map((a) => a.innerHTML);
      // const antiChrono = (a, b) => (a < b ? 1 : -1);
      // const datesSorted = [...dates].sort(antiChrono);
      // expect(datesSorted).toEqual(datesAlreadySorted);
    });
  });

  describe("When I am on Bills page but it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      document.body.innerHTML = BillsUI({ loading: true });
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });

  describe("When I am on Bills page but back-end send an error message", () => {
    test("Then, Error page should be rendered", () => {
      document.body.innerHTML = BillsUI({ error: "some error message" });
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });

  describe("When I am on Bills and there are no bills", () => {
    test("Then, no bills should be shown", () => {
      document.body.innerHTML = BillsUI({ data: [] });
      expect(screen.getByTestId("tbody")).not.toHaveTextContent(/(pending)|(accepted)|(refused)/i);
    });
  });

  describe("When I click on the icon eye", () => {
    test("A modal should open and display the attached image", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const sampleBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const modale = document.getElementById("modaleFile");
      $.fn.modal = jest.fn(() => modale.classList.add("show"));
      const handleClickIconEye = jest.fn(() => sampleBills.handleClickIconEye);
      const iconEye = screen.getAllByTestId("icon-eye")[0];

      iconEye.addEventListener("click", handleClickIconEye);
      userEvent.click(iconEye);
      expect(handleClickIconEye).toHaveBeenCalled();
      expect(modale).toHaveClass("show");

      const proof = document.querySelector(".bill-proof-container img");
      expect(proof).not.toHaveAttribute("src", "https://test.storage.tld/null");
    });
  });

  describe("When I click on the New bill button", () => {
    test("Then I should be redirected to new bill form", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const sampleBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleClickNewBill = jest.fn(sampleBills.handleClickNewBill);
      const newBillButton = screen.getByTestId("btn-new-bill");
      newBillButton.addEventListener("click", handleClickNewBill);
      userEvent.click(newBillButton);
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  });

  describe("When corrupted data was introduced", () => {
    test("Then it should return unformatted date", async () => {
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
      window.onNavigate(ROUTES_PATH.Bills);

      const sampleBills = new Bills({
        document,
        onNavigate,
        store: mockedBillsWithErrors,
        localStorage: window.localStorage,
      });
      const sampleBillsSorted = await sampleBills.getBills().then((data) => {
        const dataResult = [...data];
        return dataResult;
      });
      document.body.innerHTML = BillsUI({ data: sampleBillsSorted });
      const html = document.body.textContent;
      const pattern = /\d+[- /.]\d+[- /.]\d+/i; /* unformatted data */
      const patternResult = pattern.test(html);
      expect(patternResult).toEqual(true);
    });
  });
});


jest.mock("../app/Store.js", () => mockedBills);

// Test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("I should see the title, btn-new-bill, bill name, icon-eye, icon-window, layout-disconnect be rendered", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      /* On teste la présence du titre de la page*/
      await waitFor(() => screen.getByText("Mes notes de frais"));
      /* On test le nom d'une note de frais */
      screen.getByText("test1");
      /* 0n teste la présence de l'icone de l'oeil */
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      expect(iconEye).toBeTruthy();
      /* On teste la présence du bouton 'Nouvelle note de frais */
      const btnNewBill = screen.getByTestId("btn-new-bill");
      expect(btnNewBill).toBeTruthy();
      /* On teste la présence de l'icone window et qu'elle est en surbrillance */
      const windowIcon = document.getElementById("layout-icon1");
      expect(windowIcon).toHaveClass("active-icon");
      /* On teste la présence du bouton de déconnexion */
      const btnLogout = document.getElementById("layout-disconnect");
      expect(btnLogout).toBeTruthy();
    });
  });

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockedBills, "bills");
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockedBills.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockedBills.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});

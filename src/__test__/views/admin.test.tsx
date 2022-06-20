import { JSXElementConstructor, ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from "msw/node"; //? -> configuración del server
import { handlers } from '../../mocks/handler';
import { AuthContext } from '../../context/AuthContext';
import { AdminPage, Login } from '../../views';
import App from '../../App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../../router/PrivateRouter';
import AdminRouter from '../../router/AdminRouter';

//Setup server
const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

const renderWithRouter = (ui:ReactElement<any, string | JSXElementConstructor<any>>, route:string) => {
    window.history.pushState({},'Test page', route);

    return render(ui)
}
const startLoginAndRedirect = () => {
    // go to login page
    renderWithRouter(<App />, '/login');
    // fill form as admin
    const email    = screen.getByLabelText(/email/i) as HTMLInputElement;
    const password = screen.getByLabelText(/password/i) as HTMLInputElement;
    password.value = 'Abcdefsd*8';
    email.value    = 'saidnnnn@gmail.com';
    fireEvent.click(screen.getByRole('button', {name: 'Send'}));
}



describe('When the user is authenticated and enters on admin page', () => { 
    test.skip('Must be redirected to login page', async() => { 
        startLoginAndRedirect();

        await waitFor(() => expect(screen.getByText(/admin/i)).toBeInTheDocument(), {timeout: 2000})

        expect(screen.getByText(/jhonh dhoe/i)).toBeInTheDocument()
    });

    test('Must be redirected to login page', async() => { 
        render(
            <BrowserRouter basename = {process.env.PUBLIC_URL} >
                <AuthContext.Provider value={{userState:{user:{role:'admin', username: 'Jhonh dhoe'}, isAuth:true}, dispatch: () => {}}}>
                    <AdminPage/>
                </AuthContext.Provider>
            </BrowserRouter>
        )

        await waitFor(() => expect(screen.getByText(/admin/i)).toBeInTheDocument(), {timeout: 2000})

        expect(screen.getByText(/jhonh dhoe/i)).toBeInTheDocument()
    });

});





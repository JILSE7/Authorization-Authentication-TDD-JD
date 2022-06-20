import { JSXElementConstructor, ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { setupServer } from "msw/node"; //? -> configuración del server

import AppRouter from '../../router/AppRouter';
import { handlers } from '../../mocks/handler';
import App from '../../App';
import { AuthContext } from '../../context/AuthContext';


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


const fillFormLogin = (emailInput:string = 'said17@gmail.com' ,  passwordInput:string = 'Abcdefsd*8') => {
    
     // fill form as admin
     const email = screen.getByLabelText(/email/i) as HTMLInputElement;
     const password = screen.getByLabelText(/password/i) as HTMLInputElement;
     password.value = passwordInput
     email.value = emailInput;
    
}

describe('When the user is not authenticated and enters on admin page', () => { 
    test('Must be redirected to login page', () => { 
        renderWithRouter(<App />, '/admin');
        //must be redirect to login page because the user is not authenticated
        expect(screen.getByText(/login/i)).toBeInTheDocument();

     });
});


describe('Whe the user is not authenticated and enters employee page', () => { 
    test('Must be redirected to login page', () => { 
          renderWithRouter(<App />, '/employee');

          //must be redirect to login page because the user is not authenticated
          expect(screen.getByText(/login/i)).toBeInTheDocument();
    });
});


describe('When the user is authenticated and enters on admin page', () => { 
    
    test('Must be redirected to login page', async() => { 
        renderWithRouter(<AuthContext.Provider value={{userState:{user:{role:'admin', username: 'Jhonh dhoe'}, isAuth:true}, dispatch: () => {}}}>
                             <AppRouter/>
                        </AuthContext.Provider>, '/admin'
        );
        

        //must be redirect to login page because the user is not authenticated
        expect(screen.queryByText(/admin/i)).toBeInTheDocument();
    });
});


describe('When the admin is authenticated in login page', () => { 

    test('Must be redirected to admin page', async() => { 
        // go to login page
        renderWithRouter(<App />, '/login');
        // fill form as admin
        const email = screen.getByLabelText(/email/i) as HTMLInputElement;
        const password = screen.getByLabelText(/password/i) as HTMLInputElement;
        password.value = 'Abcdefsd*8'
        email.value = 'saidnnnn@gmail.com';
        const btn = screen.getByRole('button', {name: 'Send'})
        expect(btn).toBeInTheDocument();
        
         fireEvent.click(screen.getByRole('button', {name: 'Send'}));

        await waitFor(() => expect(screen.getByText(/admin/i)).toBeInTheDocument(), {timeout: 3000});
        expect(screen.getByText(/jhonh dhoe/i)).toBeInTheDocument();  
        
    });
});


describe('When the admin goes to employees page', () => { 
    
    test('Must have access', async() => { 
        renderWithRouter(<AuthContext.Provider value={{userState:{user:{role:'admin', username: 'Jhonh dhoe'}, isAuth:true}, dispatch: () => {}}}>
                             <AppRouter/>
                        </AuthContext.Provider>, '/admin'
        );
        

        //must be redirect to login page because the user is not authenticated
        expect(screen.queryByText(/admin/i)).toBeInTheDocument();
        const employeeBtn = screen.getByRole('button', {name: /employee/i});
        fireEvent.click(employeeBtn)

        expect(screen.getByText(/employee/i)).toBeInTheDocument();

        

        
    });
});


describe('When the employee is authenticated in login page', () => { 

    test('Must be redirected to employee page', async() => { 
        
        renderWithRouter(<AuthContext.Provider value={{userState:{user:{role:'user', username: 'Jhonh dhoe'}, isAuth:true}, dispatch: () => {}}}>
                             <AppRouter/>
                        </AuthContext.Provider>, '/login'
        );

        fillFormLogin();
         fireEvent.click(screen.getByRole('button', {name: 'Send'}));

        await waitFor(() => expect(screen.getByText(/employee/i)).toBeInTheDocument(), {timeout: 3000});
          
        expect(screen.queryByRole('button',{name:/delete/i})).toBeFalsy()
    });
});
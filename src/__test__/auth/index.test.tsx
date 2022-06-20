import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Login } from "../../views";
//* MSW
import { setupServer } from "msw/node"; //? -> configuración del server
import { handlers } from "../../mocks"; //? -> manejador de endpoints
import { rest } from "msw";

import { errorHandler } from '../../mocks/handler';
import { JSXElementConstructor, ReactElement } from "react";

import App from "../../App";


// MSW Configuración
const server = setupServer(...handlers);
const renderWithRouter = (ui:ReactElement<any, string | JSXElementConstructor<any>>, route:string) => {
    window.history.pushState({},'Test page', route);

    return render(ui)
}


beforeEach(() =>  renderWithRouter(<App />, '/login'));

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());


type TypeItem = 'getByrole' | 'getByText' | 'queryByText' | 'getByLabelText';
const getItems = (typeItem:TypeItem = 'getByrole', name:string):HTMLElement | HTMLInputElement | undefined | null => {
    if(typeItem === 'getByrole')      return screen.getByRole('button', {name: new RegExp(name, 'i')});

    if(typeItem === 'getByText')      return screen.getByText(new RegExp(name, 'i'));

    if(typeItem === 'queryByText')    return screen.queryByText(new RegExp(name, 'i'))

    if(typeItem === 'getByLabelText') return screen.getByLabelText(new RegExp(name, 'i')) as HTMLInputElement
    
};
    
const fireClickSend = () => fireEvent.click(getItems('getByrole', 'send')!);

const fillElement = (element: HTMLInputElement, fill:string) => element.value = fill;



describe('When the component Login is mounted', () => { 
    
    test('There must be a login page', () => { 
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    test('Must have a form with the following fields: email, password and submit button', () => { 
        
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /send/i})).toBeInTheDocument();
    });

});


describe('When the user leaves empty fields and clicks the submit button', () => { 
   
    test('Display required message as the format: "The [field name] is required"', () => { 
        //select button send
        const btnSend = getItems('getByrole', 'send');
        
        //must the errorEmail not be in the document when the component is mounted
        expect(getItems('queryByText', 'the email is required')).not.toBeInTheDocument();
        expect(getItems('queryByText', 'the password is required')).not.toBeInTheDocument()
        //click on button send
        fireEvent.click(btnSend!);
        
        const errorEmail = getItems('getByText', 'The email is required');
        const errorPassword = getItems('getByText', 'the password is required')
        expect(errorEmail).toBeInTheDocument()
        expect(errorPassword).toBeInTheDocument()
    });
});


describe('When the user fill the fields and clicks the submit button', () => { 

    test('Must not display required messages', async() => {   
        //fill the inputs
        screen.getByLabelText(/email/i).textContent = 'said@gmail.com';
        screen.getByLabelText(/password/i).textContent = '123456';

        fireClickSend();

        expect(screen.getByText(/said@gmail.com/i)).toBeInTheDocument();
        expect(screen.getByText(/123456/i)).toBeInTheDocument();        
    });

});

describe('When the user fills and blur the email input with invalid email', () => { 
    
    test('should show a message for blurs errors', () => { 
    
        getItems('getByLabelText', 'email')!.textContent = 'said@gmail'; //Investigar porque con firechange no cambia
        //estoy muy seguro que puede ser porque estos inputs son manejados por refs y los del otro proyecto era por states
    
        fireEvent.blur(getItems('getByLabelText', 'email')!);
        expect(getItems('getByText', 'the email is invalid')).toBeInTheDocument()
    });
});


describe('When the user fills and blur the email input with invalid email and again fill email with correct email', () => { 
    
    test('should not show a message for blurs errors', async() => { 
        
        //Select the email input
        const email = screen.getByLabelText(/email/i) as HTMLInputElement;
        //Fill de email input
        fillElement(email,"ajksajs")
        //Blur in the email input, must show a error message
        fireEvent.blur(email);
        //Expect error messages
        expect(getItems('queryByText', 'the email is invalid')).toBeInTheDocument();
        //Fill the input with valid email
        fillElement(email,"ajksajs@gmail.com");
        //Blur in the email input, must leave the error message
        fireEvent.blur(email);
        //Not error message
        expect(getItems('queryByText', 'the email is invalid')).not.toBeInTheDocument();
       
        
            
    });
});


describe('When the user fills and blur the password must contain at least 7 characteres', () => { 

    test(`Must display the validation message "The password" must contain at least 8 characters, one uppercaso letter,
          one uppercase letter, one number, and one special character`, async() => { 

        const inputPassword = getItems('getByLabelText', 'password') as HTMLInputElement;
        expect(inputPassword).toBeInTheDocument();
        fillElement(inputPassword, '1789784')
        fireEvent.blur(inputPassword);

        expect(getItems('queryByText', 'verify the password, please try again')).toBeInTheDocument();

    });
});

describe('When the user fills and blur the password and the password doesn´t have a upper character', () => { 

    test(`Must display the validation message "The password" must contain at least 8 characters, one uppercaso letter,
          one uppercase letter, one number, and one special character`, () => { 

        const inputPassword = getItems('getByLabelText', 'password') as HTMLInputElement;
        expect(inputPassword).toBeInTheDocument();

        fillElement(inputPassword, "1234567");

        fireEvent.blur(inputPassword);
        
        expect(getItems('queryByText', 'Verify the password, please try again')).toBeInTheDocument();

    });
});

describe('When the user fills and blur the password and the password doesn´t have a one number', () => { 

    test(`Must display the validation message "The password" must contain at least 8 characters, one uppercaso letter,
          one uppercase letter, one number, and one special character`, () => { 

        const inputPassword = getItems('getByLabelText', 'password') as HTMLInputElement;

        expect(inputPassword).toBeInTheDocument();
        fillElement(inputPassword,"Abcdefg");

        fireEvent.blur(inputPassword);
        
        expect(getItems('queryByText', 'verify the password, please try again')).toBeInTheDocument();

    });
});

describe('When the user fills and blur the password and the password doesn´t have a one special character', () => { 

    test(`Must display the validation message "The password" must contain at least 8 characters, one uppercaso letter,
          one uppercase letter, one number, and one special character`, () => { 

        const inputPassword = getItems('getByLabelText', 'password') as HTMLInputElement;
        expect(inputPassword).toBeInTheDocument();

        fillElement(inputPassword,"Abcdefg8");

        fireEvent.blur(inputPassword);
        
        expect(getItems('queryByText', 'verify the password')).toBeInTheDocument();

    });
});


describe('When the user fills and blur and pass all validation for password', () => { 

    test(`Must display the validation message "The password" must contain at least 8 characters, one uppercaso letter,
          one uppercase letter, one number, and one special character`, () => { 

        const inputPassword = getItems('getByLabelText', 'password') as HTMLInputElement;
        expect(inputPassword).toBeInTheDocument();
        //lest 8 characters
        fillElement(inputPassword,"abcdefs");
        
        fireEvent.blur(inputPassword);
        expect(getItems('queryByText', 'verify the password')).toBeInTheDocument();
        //pass 8 characters
        fillElement(inputPassword,"abcdefsd");
        fireEvent.blur(inputPassword);
        expect(getItems('queryByText', 'verify the password')).toBeInTheDocument();

        //A upper character
        fillElement(inputPassword,"Abcdefsd");
        fireEvent.blur(inputPassword);
        expect(getItems('queryByText', 'verify the password')).toBeInTheDocument();

        //A special character
        fillElement(inputPassword,"Abcdefsd*");
        fireEvent.blur(inputPassword);
        expect(getItems('queryByText', 'verify the password')).toBeInTheDocument();

        //A number character and pass all test to field password
        fillElement(inputPassword,"Abcdefsd*8");
        fireEvent.blur(inputPassword);
        expect(getItems('queryByText', 'verify the password')).not.toBeInTheDocument();
    });
});


describe('When the user fills submit the login form with valid data', () => { 
    
    test('Must disable the submit button while the form page is fetching the data', async() => { 
        await waitFor(() => expect(screen.getByRole('button', {name: /send/i})).not.toBeDisabled());
        
        fillElement( getItems('getByLabelText', 'password') as HTMLInputElement,'saidnnnn@gmail.com');
        fillElement(getItems('getByLabelText', 'email')! as HTMLInputElement,"Abcdefsd*8");
        
        //click on send button
        fireClickSend();

        expect(getItems('getByrole', 'send')).toBeDisabled();

        await waitFor(() => expect(getItems('getByrole', 'send')!).not.toBeDisabled());
    });


    test('Must be a loading indicator at the top of the form while it is fetching', async() => { 
        
        //expect(screen.queryAllByTestId('loading_indicator')[0]).toBeUndefined();
        fillElement( getItems('getByLabelText', 'password') as HTMLInputElement,'saidnnnn@gmail.com');
        fillElement(getItems('getByLabelText', 'email')! as HTMLInputElement,"Abcdefsd*8");
        //click on send button
        fireEvent.click(getItems('getByrole', 'send')!)

        await waitFor(() => expect(screen.getAllByTestId('loading_indicator').length).toBe(3))
        await waitForElementToBeRemoved( () => screen.queryAllByTestId('loading_indicator'), {timeout: 1500});
        
    });

});


describe('When the user submit the login form with valid data and there is an unexpected server error', () => { 

    test.skip('Must display the error message "Unexpected error, please try again" from the api', async() => { 
        //? setup - server
        server.use(
            rest.post('/login',(_, res, ctx) => 
            res(ctx.status(500), ctx.json({message: 'Unexpected error, please try again'}))
        ));

        //error messages not must be in the document
       expect(screen.queryByText(/unexpected error, please try again/i)).not.toBeInTheDocument();

        //fill the inputs
        fillElement( getItems('getByLabelText', 'password') as HTMLInputElement,'saidnnnn@gmail.com');
        fillElement(getItems('getByLabelText', 'email')! as HTMLInputElement,"Abcdefsd*8");
        //click on the button send
        fireClickSend();
        

        //seek a error messages
       await waitFor(() =>expect(screen.findAllByText(/unexpected error, please try again/i)).toBeInTheDocument(), {timeout: 3000});
    })
});


describe('When the user submit the login form with valid data and there is an invalid credentials error', () => { 

    test('Must display the error message "The email or password are not correct" from the api', async() => { 
        const wrongeEmail    = 'saidnnnn17@gmail.com';
        const wrongPassword = 'Abcdefghi*1';
        //error messages not must be in the document
       expect(screen.queryByText(/bad credencials/i)).not.toBeInTheDocument();
       
        server.use(errorHandler(wrongeEmail, wrongPassword));

        //fill the inputs
        fillElement(getItems('getByLabelText', 'password') as HTMLInputElement, wrongPassword);
        fillElement(getItems('getByLabelText', 'email')! as HTMLInputElement, wrongeEmail);

        //click on the button send
        fireClickSend();

        
        //seek a error messages
        expect(await screen.findByText(/bad credencials/i)).toBeInTheDocument();
    });
});




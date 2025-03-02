import "@testing-library/jest-dom"
import {cleanup} from "@testing-library/react";
import 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';


fetchMock.enableMocks();

global.fetch = fetchMock as unknown as typeof fetch;;

afterEach(()=>{
    cleanup();
})

beforeEach(() => {
    fetchMock.resetMocks(); // Resets mocks before each test
});
jest.useFakeTimers();
import React from "react";
import renderer from "react-test-renderer";
import App from "../App";
 
describe("<App />", () => {
    it("has children" , () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree.children.length).toBeGreaterThanOrEqual(1);
    });
   it('renders correctly', () => {
       const tree = renderer.create(<App />).toJSON();
       expect(tree).toMatchSnapshot();
   });
});

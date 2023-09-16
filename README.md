# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# To run web app locally
- npm i
- npm run dev


# To deploy image to docker
- docker build --platform=linux/amd64 -t tiwala-test-app:0.0.1 .
- docker tag tiwala-test-app:0.0.1 dockerhubuser/test-web-app:0.0.1
- docker push dockerhubuser/test-web-app:0.0.1
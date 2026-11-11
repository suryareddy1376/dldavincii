# DL Davincii

Interactive Next.js App Router workbench containing all 16 self contained TensorFlow and Keras 3 deep learning experiments extracted verbatim from `DL_Lab_All_Experiments_Keras.ipynb`.

## Features

- **16 verbatim Keras 3 cells**: Copy individual experiment cells, the Colab `%pip` setup command, or all 16 cells at once, or download individual `.py` files and the full `.ipynb` notebook.
- **Stepwise algorithms & viva Q&A**: Every experiment includes a numbered implementation algorithm, copyable lab sheet `.md` export, and the 4 most important viva questions with self quiz hide/reveal controls (64 questions total).
- **Architecture & dataset inspector**: View layer by layer model topologies, optimizers, loss functions, seeds, GPU runtime flags (`Ex 06`, `Ex 07`, `Ex 12b`, `Ex 14`), Kaggle folder paths, and CSV upload fallbacks.
- **Interactive math lab**: Explore `Sigmoid`, `Tanh`, and `ReLU` values and derivatives across `z in [-6, 6]` matching Ex 05.
- **Keyboard navigation**: Press `/` to focus search, `J` or `K` to step across experiments, or use the mobile quick jump switcher and stacked catalog cards on narrow viewports.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Push to GitHub

```bash
git add .
git commit -m "Add algorithm, viva Q&A, and mobile layout optimization"
git push -u origin main
```

## Deploy to Vercel

Push this folder to a Git repository and import it in Vercel, or deploy directly with the Vercel CLI:

```bash
npx vercel
```

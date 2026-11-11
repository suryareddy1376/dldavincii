// Auto-generated verbatim from DL_Lab_All_Experiments_Keras.ipynb
export type ExperimentCategory =
  | "Perceptrons & MLPs"
  | "CNNs & Vision"
  | "Regularization & Optimizers"
  | "Sequences & Forecasting";

export type LayerKind =
  | "input"
  | "conv"
  | "pool"
  | "dense"
  | "recurrent"
  | "norm"
  | "aug"
  | "output";

export interface ArchitectureLayer {
  name: string;
  detail: string;
  kind: LayerKind;
}

export interface ExperimentItem {
  id: string;
  codeLabel: string;
  title: string;
  aim: string;
  category: ExperimentCategory;
  runtime: "CPU" | "GPU Recommended";
  gpuRequired: boolean;
  datasetName: string;
  datasetSetup: string;
  datasetNotes: string;
  modelType: string;
  optimizer: string;
  loss: string;
  epochs: string;
  batchSize: string;
  seed: string;
  layers: ArchitectureLayer[];
  highlights: string[];
  code: string;
  lineCount: number;
}

export const SETUP_COMMAND = "%pip -q install tensorflow-datasets yfinance";

export const EXPERIMENTS: ExperimentItem[] = [
  {
    "id": "ex-01",
    "codeLabel": "Ex 01",
    "title": "Understanding the Perceptron",
    "aim": "Classify Iris Setosa vs Versicolor using a single sigmoid neuron in Keras.",
    "category": "Perceptrons & MLPs",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "Iris (Setosa vs Versicolor)",
    "datasetSetup": "Built in",
    "datasetNotes": "Loads directly from scikit learn with 100 linearly separable samples and 4 features.",
    "modelType": "Single sigmoid neuron",
    "optimizer": "SGD (lr = 0.1)",
    "loss": "binary_crossentropy",
    "epochs": "15",
    "batchSize": "8",
    "seed": "2017",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(4,)",
        "kind": "input"
      },
      {
        "name": "Dense(1)",
        "detail": "activation=sigmoid",
        "kind": "output"
      }
    ],
    "highlights": [
      "Fits StandardScaler exclusively on X_train to keep sigmoid inputs out of saturation.",
      "Extracts learned weights and bias directly from layer zero after 15 epochs.",
      "Plots sepal length vs petal length scatter alongside loss and validation accuracy."
    ],
    "code": "# Ex-1  Understanding the Perceptron (Iris: Setosa vs Versicolor)\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nSEED = 2017\nkeras.utils.set_random_seed(SEED)\n\n# 1. Load data: keep the two linearly separable classes (0 = Setosa, 1 = Versicolor)\niris = load_iris()\nidx = np.where(iris.target < 2)\nX = iris.data[idx].astype(\"float32\")\ny = iris.target[idx].astype(\"float32\")\n\n# 2. Plot two of the four variables\nplt.scatter(X[y == 0][:, 0], X[y == 0][:, 2], color=\"green\", label=\"Iris-Setosa\")\nplt.scatter(X[y == 1][:, 0], X[y == 1][:, 2], color=\"red\", label=\"Iris-Versicolour\")\nplt.xlabel(\"sepal length (cm)\"); plt.ylabel(\"petal length (cm)\"); plt.legend(); plt.show()\n\n# 3. Train / validation split\nX_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=SEED)\nscaler = StandardScaler().fit(X_train)                 # scaled inputs keep the sigmoid out of saturation\nX_train, X_val = scaler.transform(X_train), scaler.transform(X_val)\n\n# 4. Perceptron = one neuron: weighted sum + bias -> sigmoid (output > 0.5 means class 1)\nmodel = keras.Sequential([\n    keras.Input(shape=(X_train.shape[1],)),\n    layers.Dense(1, activation=\"sigmoid\"),\n])\nmodel.compile(optimizer=keras.optimizers.SGD(learning_rate=0.1),\n              loss=\"binary_crossentropy\",\n              metrics=[keras.metrics.BinaryAccuracy(name=\"accuracy\")])\nmodel.summary()\n\n# 5. Train\nhistory = model.fit(X_train, y_train, epochs=15, batch_size=8,\n                    validation_data=(X_val, y_val), verbose=2)\n\n# 6. Learned parameters and final score\nw, b = model.layers[0].get_weights()\nprint(\"Weights:\", w.ravel(), \"| bias:\", b)\nval_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)\nprint(f\"Validation loss: {val_loss:.4f} | Validation accuracy: {val_acc:.4f}\")\n\n# 7. Plot training loss and validation accuracy\nfig, ax = plt.subplots(1, 2, figsize=(8, 4))\nax[0].plot(history.history[\"loss\"]); ax[0].set_title(\"Training loss\"); ax[0].set_xlabel(\"epochs\")\nax[1].plot(history.history[\"val_accuracy\"]); ax[1].set_title(\"Validation accuracy\"); ax[1].set_xlabel(\"epochs\")\nplt.tight_layout(); plt.show()",
    "lineCount": 53
  },
  {
    "id": "ex-02",
    "codeLabel": "Ex 02",
    "title": "Perceptron on the Diabetes dataset",
    "aim": "Train a binary perceptron on BMI features and report accuracy, precision, recall, and F1.",
    "category": "Perceptrons & MLPs",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "Diabetes (BMI column)",
    "datasetSetup": "Built in",
    "datasetNotes": "Loads via sklearn.datasets.load_diabetes and binarizes targets at progression > 140.",
    "modelType": "Single sigmoid neuron",
    "optimizer": "Adam (lr = 0.05)",
    "loss": "binary_crossentropy",
    "epochs": "100",
    "batchSize": "32",
    "seed": "42",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(1,)",
        "kind": "input"
      },
      {
        "name": "Dense(1)",
        "detail": "activation=sigmoid",
        "kind": "output"
      }
    ],
    "highlights": [
      "Slices single BMI feature column and converts continuous targets to binary labels.",
      "Computes test accuracy, precision, recall, F1 score, and confusion matrix.",
      "Plots training and validation curves across 100 epochs with a 20% validation split."
    ],
    "code": "# Ex-2  Perceptron on the Diabetes dataset (binary: progression > 140 or not)\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn import datasets\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import (accuracy_score, precision_score, recall_score,\n                             f1_score, confusion_matrix, ConfusionMatrixDisplay)\n\nkeras.utils.set_random_seed(42)\n\n# 1. Load data\ndiabetes = datasets.load_diabetes()\nX, y = diabetes.data, diabetes.target\n\n# 2. Preprocess: use one feature (BMI, column 2) and binarise the target\nX = X[:, np.newaxis, 2]\ny = (y > 140).astype(\"float32\")\n\n# 3. Split and standardise (fit scaler on train only)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nscaler = StandardScaler().fit(X_train)\nX_train, X_test = scaler.transform(X_train), scaler.transform(X_test)\n\n# 4. Perceptron: a single sigmoid neuron\nmodel = keras.Sequential([\n    keras.Input(shape=(1,)),\n    layers.Dense(1, activation=\"sigmoid\"),\n])\nmodel.compile(optimizer=keras.optimizers.Adam(learning_rate=0.05),\n              loss=\"binary_crossentropy\",\n              metrics=[keras.metrics.BinaryAccuracy(name=\"accuracy\")])\n\nhistory = model.fit(X_train, y_train, epochs=100, batch_size=32,\n                    validation_split=0.2, verbose=0)\n\n# 5. Evaluate on the test set\ny_pred = (model.predict(X_test, verbose=0).ravel() > 0.5).astype(int)\nprint(\"Accuracy :\", round(accuracy_score(y_test, y_pred), 4))\nprint(\"Precision:\", round(precision_score(y_test, y_pred, zero_division=0), 4))\nprint(\"Recall   :\", round(recall_score(y_test, y_pred, zero_division=0), 4))\nprint(\"F1 score :\", round(f1_score(y_test, y_pred, zero_division=0), 4))\n\nfig, ax = plt.subplots(1, 3, figsize=(14, 4))\nax[0].plot(history.history[\"loss\"], label=\"train\"); ax[0].plot(history.history[\"val_loss\"], label=\"val\")\nax[0].set_title(\"Loss\"); ax[0].set_xlabel(\"epochs\"); ax[0].legend()\nax[1].plot(history.history[\"accuracy\"], label=\"train\"); ax[1].plot(history.history[\"val_accuracy\"], label=\"val\")\nax[1].set_title(\"Accuracy\"); ax[1].set_xlabel(\"epochs\"); ax[1].legend()\nConfusionMatrixDisplay(confusion_matrix(y_test, y_pred)).plot(ax=ax[2], colorbar=False)\nax[2].set_title(\"Confusion matrix (test)\")\nplt.tight_layout(); plt.show()",
    "lineCount": 53
  },
  {
    "id": "ex-03",
    "codeLabel": "Ex 03",
    "title": "Single hidden layer neural network",
    "aim": "Train a neural network with 50 hidden sigmoid units on the two circles dataset.",
    "category": "Perceptrons & MLPs",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "Two Circles (400 samples)",
    "datasetSetup": "Built in",
    "datasetNotes": "Generated with sklearn.datasets.make_circles using factor=0.3 and noise=0.05.",
    "modelType": "1 hidden layer MLP",
    "optimizer": "SGD (lr = 1.0)",
    "loss": "mse",
    "epochs": "1000",
    "batchSize": "Full batch (320)",
    "seed": "2017",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(2,)",
        "kind": "input"
      },
      {
        "name": "Dense(50)",
        "detail": "sigmoid, no bias, N(0,1)",
        "kind": "dense"
      },
      {
        "name": "Dense(1)",
        "detail": "sigmoid, no bias, N(0,1)",
        "kind": "output"
      }
    ],
    "highlights": [
      "Runs full batch gradient descent over the entire 320 sample training split.",
      "Uses a custom Keras Callback to log validation metrics every 100 epochs.",
      "Evaluates a 200x200 meshgrid to plot the nonlinear decision boundary."
    ],
    "code": "# Ex-3  Single-hidden-layer neural network on the \"two circles\" dataset\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn.datasets import make_circles\nfrom sklearn.model_selection import train_test_split\n\nSEED = 2017\nkeras.utils.set_random_seed(SEED)\n\n# 1. Data\nX, y = make_circles(n_samples=400, factor=0.3, noise=0.05, random_state=SEED)\nouter, inner = y == 0, y == 1\nplt.title(\"Two Circles\")\nplt.plot(X[outer, 0], X[outer, 1], \"ro\"); plt.plot(X[inner, 0], X[inner, 1], \"bo\"); plt.show()\n\nX = (X + 1).astype(\"float32\")\ny = y.astype(\"float32\")\nX_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=SEED)\n\n# 2. Model: 2 inputs -> 50 sigmoid hidden units -> 1 sigmoid output\nn_hidden, n_epochs, learning_rate = 50, 1000, 1.0\nmodel = keras.Sequential([\n    keras.Input(shape=(2,)),\n    layers.Dense(n_hidden, activation=\"sigmoid\", use_bias=False,\n                 kernel_initializer=keras.initializers.RandomNormal(0.0, 1.0)),   # weights ~ N(0, 1), as in the manual\n    layers.Dense(1, activation=\"sigmoid\", use_bias=False,\n                 kernel_initializer=keras.initializers.RandomNormal(0.0, 1.0)),\n])\nmodel.compile(optimizer=keras.optimizers.SGD(learning_rate=learning_rate),\n              loss=\"mse\",\n              metrics=[keras.metrics.BinaryAccuracy(name=\"accuracy\")])\nmodel.summary()\n\n# 3. Print validation stats every 100 epochs\nclass Report(keras.callbacks.Callback):\n    def on_epoch_end(self, epoch, logs=None):\n        if epoch % 100 == 0:\n            print(f\"Epoch: {epoch:>4} ; Validation loss: {logs['val_loss']:.4f} ; \"\n                  f\"Validation accuracy: {logs['val_accuracy']:.4f}\")\n\n# Full-batch gradient descent (batch = whole training set), as in the manual\nhistory = model.fit(X_train, y_train, epochs=n_epochs, batch_size=len(X_train),\n                    validation_data=(X_val, y_val), verbose=0, callbacks=[Report()])\n\nloss, acc = model.evaluate(X_val, y_val, verbose=0)\nprint(f\"\\nFinal validation loss: {loss:.4f} | accuracy: {acc:.4f}\")\n\n# 4. Curves and decision boundary\nfig, ax = plt.subplots(1, 3, figsize=(15, 4))\nax[0].plot(history.history[\"loss\"], label=\"train\"); ax[0].plot(history.history[\"val_loss\"], label=\"val\")\nax[0].set_title(\"Loss\"); ax[0].set_xlabel(\"epochs\"); ax[0].legend()\nax[1].plot(history.history[\"accuracy\"], label=\"train\"); ax[1].plot(history.history[\"val_accuracy\"], label=\"val\")\nax[1].set_title(\"Accuracy\"); ax[1].set_xlabel(\"epochs\"); ax[1].legend()\ngx, gy = np.meshgrid(np.linspace(X[:, 0].min() - .2, X[:, 0].max() + .2, 200),\n                     np.linspace(X[:, 1].min() - .2, X[:, 1].max() + .2, 200))\nzz = model.predict(np.c_[gx.ravel(), gy.ravel()].astype(\"float32\"), verbose=0).reshape(gx.shape)\nax[2].contourf(gx, gy, zz > 0.5, alpha=0.3, cmap=\"coolwarm\")\nax[2].scatter(X_val[:, 0], X_val[:, 1], c=y_val, cmap=\"coolwarm\", edgecolor=\"k\")\nax[2].set_title(\"Decision boundary (validation points)\")\nplt.tight_layout(); plt.show()",
    "lineCount": 62
  },
  {
    "id": "ex-04",
    "codeLabel": "Ex 04",
    "title": "Multi layer neural network",
    "aim": "Build a deep regression network for Wine Quality with early stopping and checkpointing.",
    "category": "Perceptrons & MLPs",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "Wine Quality Red (UCI)",
    "datasetSetup": "Auto download",
    "datasetNotes": "Fetches winequality-red.csv from UCI or GitHub mirror; supports manual Colab upload.",
    "modelType": "3 layer Dense regressor",
    "optimizer": "Adam",
    "loss": "mse (metric: mae)",
    "epochs": "500 (EarlyStopping)",
    "batchSize": "64",
    "seed": "2017",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(11,)",
        "kind": "input"
      },
      {
        "name": "Dense(200)",
        "detail": "activation=relu",
        "kind": "dense"
      },
      {
        "name": "Dense(25)",
        "detail": "activation=relu",
        "kind": "dense"
      },
      {
        "name": "Dense(1)",
        "detail": "activation=linear",
        "kind": "output"
      }
    ],
    "highlights": [
      "Compares test MSE against a constant mean prediction baseline.",
      "Stops early with patience=30 and restores best weights automatically.",
      "Saves best checkpoint to multi_layer_best_model.keras and evaluates rounded accuracy."
    ],
    "code": "# Ex-4  Multi-layer neural network (regression on Wine Quality - red)\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nSEED = 2017\nkeras.utils.set_random_seed(SEED)\n\ndef load_wine():\n    urls = [\"https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv\",\n            \"https://raw.githubusercontent.com/shrikant-temburwar/Wine-Quality-Dataset/master/winequality-red.csv\"]\n    for u in urls:\n        try:\n            return pd.read_csv(u, sep=\";\")\n        except Exception as e:\n            print(\"could not read\", u, \"->\", type(e).__name__)\n    # Last resort: upload winequality-red.csv to Colab and use pd.read_csv(\"winequality-red.csv\", sep=\";\")\n    raise RuntimeError(\"Wine data not reachable\")\n\ndata = load_wine()\ny = data[\"quality\"]\nX = data.drop([\"quality\"], axis=1)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED)\nprint(\"Average quality (train): {:.4f}\".format(y_train.mean()))\n\nscaler = StandardScaler().fit(X_train)\nX_train = scaler.transform(X_train).astype(\"float32\")\nX_test = scaler.transform(X_test).astype(\"float32\")\n\n# Baseline: always predict the mean quality\nprint(\"Baseline MSE:\", np.mean((y_test - y_train.mean()) ** 2))\n\n# Network: 200 -> 25 -> 1 (linear output for regression)\nmodel = keras.Sequential([\n    keras.Input(shape=(X_train.shape[1],)),\n    layers.Dense(200, activation=\"relu\"),\n    layers.Dense(25, activation=\"relu\"),\n    layers.Dense(1, activation=\"linear\"),\n])\nmodel.compile(optimizer=keras.optimizers.Adam(), loss=\"mse\", metrics=[\"mae\"])\nmodel.summary()\n\n# Early stopping + keep the best weights (what ModelCheckpoint did in the manual)\ncallbacks = [\n    keras.callbacks.EarlyStopping(monitor=\"val_loss\", patience=30, restore_best_weights=True, verbose=1),\n    keras.callbacks.ModelCheckpoint(\"multi_layer_best_model.keras\", monitor=\"val_loss\",\n                                    save_best_only=True, verbose=0),\n]\nhistory = model.fit(X_train, y_train.values, batch_size=64, epochs=500,\n                    validation_split=0.2, callbacks=callbacks, verbose=2)\n\n# Evaluate the best model on the test set\nmse, mae = model.evaluate(X_test, y_test.values, verbose=0)\npred = model.predict(X_test, verbose=0).ravel()\nacc = np.mean(np.round(pred) == y_test.values)   # quality is an integer, so round the prediction\nprint(f\"Test MSE: {mse:.4f} | Test MAE: {mae:.4f} | Rounded-quality accuracy: {acc*100:.2f}%\")\nprint(\"Benchmark accuracy on this dataset: 62.4%\")\n\nplt.plot(history.history[\"loss\"], label=\"train\"); plt.plot(history.history[\"val_loss\"], label=\"validation\")\nplt.title(\"Multi-layer network: MSE loss\"); plt.xlabel(\"epochs\"); plt.legend(); plt.show()",
    "lineCount": 65
  },
  {
    "id": "ex-05",
    "codeLabel": "Ex 05",
    "title": "Activation functions",
    "aim": "Compare sigmoid and ReLU in an 8 layer network on MNIST by batch loss and layer weights.",
    "category": "Perceptrons & MLPs",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "MNIST Handwritten Digits",
    "datasetSetup": "Built in",
    "datasetNotes": "Loaded via keras.datasets.mnist, flattened to 784 features, scaled to [0, 1].",
    "modelType": "8 layer Dense classifier",
    "optimizer": "SGD",
    "loss": "categorical_crossentropy",
    "epochs": "10",
    "batchSize": "256",
    "seed": "2022",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(784,)",
        "kind": "input"
      },
      {
        "name": "5x Dense(700)",
        "detail": "sigmoid vs relu",
        "kind": "dense"
      },
      {
        "name": "Dense(350)",
        "detail": "sigmoid vs relu",
        "kind": "dense"
      },
      {
        "name": "Dense(100)",
        "detail": "sigmoid vs relu",
        "kind": "dense"
      },
      {
        "name": "Dense(10)",
        "detail": "activation=softmax",
        "kind": "output"
      }
    ],
    "highlights": [
      "Plots sigmoid, tanh, and ReLU curves across [-6, 6] before training.",
      "Records per batch training loss via BatchLoss callback to expose vanishing gradients.",
      "Bars maximum weight and bias magnitude across every dense layer."
    ],
    "code": "# Ex-5  Experiment with activation functions: sigmoid vs ReLU on MNIST\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\n\nSEED = 2022\nkeras.utils.set_random_seed(SEED)\n\n# 1. Plot the activation functions themselves\nz = np.linspace(-6, 6, 200)\nplt.figure(figsize=(10, 3))\nfor i, (name, f) in enumerate({\"sigmoid\": lambda v: 1 / (1 + np.exp(-v)),\n                               \"tanh\": np.tanh,\n                               \"ReLU\": lambda v: np.maximum(0, v)}.items()):\n    plt.subplot(1, 3, i + 1); plt.plot(z, f(z)); plt.title(name); plt.grid(alpha=.3)\nplt.tight_layout(); plt.show()\n\n# 2. Data: MNIST, normalised and flattened\n(X_train, y_train), (X_val, y_val) = keras.datasets.mnist.load_data()\nplt.figure(figsize=(12, 3))\nfor label in range(10):\n    plt.subplot(1, 10, label + 1); plt.axis(\"off\")\n    plt.title(f\"{label}: ({int((y_train == label).sum())})\", fontsize=7)\n    plt.imshow(X_train[np.where(y_train == label)[0][0]], cmap=\"gray\")\nplt.show()\n\nX_train = X_train.reshape(-1, 784).astype(\"float32\") / 255.0\nX_val = X_val.reshape(-1, 784).astype(\"float32\") / 255.0\ny_train = keras.utils.to_categorical(y_train, 10)\ny_val = keras.utils.to_categorical(y_val, 10)\n\n# 3. Same deep network, two activations\ndef build(activation):\n    m = keras.Sequential([keras.Input(shape=(784,))])\n    for units in [700, 700, 700, 700, 700, 350, 100]:\n        m.add(layers.Dense(units, activation=activation))\n    m.add(layers.Dense(10, activation=\"softmax\"))\n    m.compile(loss=\"categorical_crossentropy\", optimizer=\"sgd\", metrics=[\"accuracy\"])\n    return m\n\nclass BatchLoss(keras.callbacks.Callback):\n    def on_train_begin(self, logs=None):\n        self.losses = []\n    def on_train_batch_end(self, batch, logs=None):\n        self.losses.append(logs.get(\"loss\"))\n\nmodels, losses = {}, {}\nfor act in [\"sigmoid\", \"relu\"]:\n    m, cb = build(act), BatchLoss()\n    m.fit(X_train, y_train, epochs=10, batch_size=256, validation_split=0.2,\n          callbacks=[cb], verbose=2)\n    models[act], losses[act] = m, cb.losses\n    print(act, \"validation-set accuracy:\", round(m.evaluate(X_val, y_val, verbose=0)[1], 4))\n\n# 4. Loss per batch\nfor act in losses:\n    plt.plot(losses[act], label=act)\nplt.title(\"Losses for sigmoid and ReLU model\"); plt.xlabel(\"number of batches\"); plt.ylabel(\"loss\")\nplt.legend(); plt.show()\n\n# 5. Largest weight and bias in each layer\nfig, axes = plt.subplots(1, 2, figsize=(12, 4))\nn_layers = len(models[\"sigmoid\"].layers)\nidx, bw = np.arange(n_layers), 0.35\nfor ax, (what, pos) in zip(axes, [(\"weight\", 0), (\"bias\", 1)]):\n    for k, (act, color) in enumerate([(\"sigmoid\", \"b\"), (\"relu\", \"r\")]):\n        vals = [np.max(l.get_weights()[pos]) for l in models[act].layers]\n        ax.bar(idx + k * bw, vals, bw, label=act, color=color, alpha=0.4)\n    ax.set_title(f\"Maximum {what} per layer\"); ax.set_xlabel(\"layer number\"); ax.legend()\nplt.tight_layout(); plt.show()",
    "lineCount": 71
  },
  {
    "id": "ex-06",
    "codeLabel": "Ex 06",
    "title": "Vehicle type recognition",
    "aim": "Recognise vehicle types using a CNN built via transfer learning from frozen VGG16.",
    "category": "CNNs & Vision",
    "runtime": "GPU Recommended",
    "gpuRequired": true,
    "datasetName": "Vehicle Type Recognition (Kaggle)",
    "datasetSetup": "Kaggle local path",
    "datasetNotes": "Provide class subfolders at DATASET_PATH (/content/Dataset or Kaggle input path).",
    "modelType": "VGG16 transfer learning",
    "optimizer": "RMSprop (lr = 1e-4)",
    "loss": "categorical_crossentropy",
    "epochs": "15",
    "batchSize": "32",
    "seed": "42",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(224, 224, 3)",
        "kind": "input"
      },
      {
        "name": "Augmentation",
        "detail": "Flip, Rotate, Zoom, Translate",
        "kind": "aug"
      },
      {
        "name": "VGG16 Base",
        "detail": "ImageNet, frozen weights",
        "kind": "conv"
      },
      {
        "name": "Flatten + Dense(256)",
        "detail": "relu + Dropout(0.3)",
        "kind": "dense"
      },
      {
        "name": "Dense(N)",
        "detail": "activation=softmax",
        "kind": "output"
      }
    ],
    "highlights": [
      "Uses identical seed=42 for training and validation splits so subsets remain disjoint.",
      "Applies vgg16.preprocess_input after in graph random augmentation layers.",
      "Collects y_true and y_pred in one deterministic loop for classification_report."
    ],
    "code": "# Ex-6  Vehicle type recognition: transfer learning with VGG16\nimport os\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay\n\n# ---- Set this to your dataset folder: one sub-folder per vehicle class ----\n# Kaggle notebook : \"/kaggle/input/vehicle-type-recognition/Dataset\"\n# Colab           : upload/unzip the dataset and point to it, e.g. \"/content/Dataset\"\nDATASET_PATH = \"/content/Dataset\"\nIMG_SIZE, BATCH, EPOCHS, SEED = (224, 224), 32, 15, 42\n\nif not os.path.isdir(DATASET_PATH):\n    raise FileNotFoundError(f\"{DATASET_PATH} not found. Upload the vehicle dataset and fix DATASET_PATH.\")\nkeras.utils.set_random_seed(SEED)\n\n# 1. Load images, 80/20 train/validation split, one-hot labels\ncommon = dict(validation_split=0.2, seed=SEED, image_size=IMG_SIZE, batch_size=BATCH, label_mode=\"categorical\")\ntrain_ds = keras.utils.image_dataset_from_directory(DATASET_PATH, subset=\"training\", **common)\nval_ds = keras.utils.image_dataset_from_directory(DATASET_PATH, subset=\"validation\", **common)   # same seed => disjoint split\nclass_names = train_ds.class_names\nNUM_CLASSES = len(class_names)\nprint(\"Classes:\", class_names)\ntrain_ds = train_ds.prefetch(2); val_ds = val_ds.prefetch(2)\n\n# 2. Look at a few training images\nplt.figure(figsize=(8, 8))\nfor images, labels in train_ds.take(1):\n    for i in range(min(9, len(images))):\n        plt.subplot(3, 3, i + 1); plt.imshow(images[i].numpy().astype(\"uint8\"))\n        plt.title(class_names[int(np.argmax(labels[i]))]); plt.axis(\"off\")\nplt.show()\n\n# 3. Model: augmentation -> frozen VGG16 base -> new classifier head\nbase = keras.applications.VGG16(weights=\"imagenet\", include_top=False, input_shape=IMG_SIZE + (3,))\nbase.trainable = False\n\ninputs = keras.Input(shape=IMG_SIZE + (3,))\nx = layers.RandomFlip(\"horizontal\")(inputs)\nx = layers.RandomRotation(0.1)(x)\nx = layers.RandomZoom(0.2)(x)\nx = layers.RandomTranslation(0.1, 0.1)(x)\nx = keras.applications.vgg16.preprocess_input(x)\nx = base(x, training=False)\nx = layers.Flatten()(x)\nx = layers.Dense(256, activation=\"relu\")(x)\nx = layers.Dropout(0.3)(x)\noutputs = layers.Dense(NUM_CLASSES, activation=\"softmax\")(x)\nmodel = keras.Model(inputs, outputs)\n\nmodel.compile(loss=\"categorical_crossentropy\",\n              optimizer=keras.optimizers.RMSprop(learning_rate=1e-4), metrics=[\"accuracy\"])\nmodel.summary()\n\n# 4. Train\nhistory = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)\n\nfig, ax = plt.subplots(1, 2, figsize=(12, 4))\nax[0].plot(history.history[\"accuracy\"], label=\"train\"); ax[0].plot(history.history[\"val_accuracy\"], label=\"val\")\nax[0].set_title(\"Accuracy\"); ax[0].legend()\nax[1].plot(history.history[\"loss\"], label=\"train\"); ax[1].plot(history.history[\"val_loss\"], label=\"val\")\nax[1].set_title(\"Loss\"); ax[1].legend()\nplt.show()\n\n# 5. Evaluate: accuracy, per-class report and confusion matrix\nloss, acc = model.evaluate(val_ds, verbose=0)\nprint(f\"Validation accuracy: {acc:.4f}\")\ny_true, y_pred = [], []                      # collect labels and predictions in the SAME pass\nfor images, labels in val_ds:\n    y_pred.extend(np.argmax(model.predict(images, verbose=0), axis=1))\n    y_true.extend(np.argmax(labels.numpy(), axis=1))\ny_true, y_pred = np.array(y_true), np.array(y_pred)\nlabels = list(range(NUM_CLASSES))\nprint(classification_report(y_true, y_pred, labels=labels, target_names=class_names, zero_division=0))\nConfusionMatrixDisplay(confusion_matrix(y_true, y_pred, labels=labels), display_labels=class_names).plot(xticks_rotation=45)\nplt.show()\n\n# 6. Predictions on validation images\nplt.figure(figsize=(10, 10))\nfor images, labels in val_ds.take(1):\n    probs = model.predict(images, verbose=0)\n    for i in range(min(9, len(images))):\n        plt.subplot(3, 3, i + 1); plt.imshow(images[i].numpy().astype(\"uint8\"))\n        plt.title(f\"True: {class_names[int(np.argmax(labels[i]))]}\\nPred: {class_names[int(np.argmax(probs[i]))]}\")\n        plt.axis(\"off\")\nplt.tight_layout(); plt.show()",
    "lineCount": 88
  },
  {
    "id": "ex-07",
    "codeLabel": "Ex 07",
    "title": "Diabetic Retinopathy",
    "aim": "Classify retinal images into 5 severity levels using a custom CNN and augmentation.",
    "category": "CNNs & Vision",
    "runtime": "GPU Recommended",
    "gpuRequired": true,
    "datasetName": "Diabetic Retinopathy (Kaggle)",
    "datasetSetup": "Kaggle local path",
    "datasetNotes": "Set IMG_DIR (/content/dr_images) and LABELS_CSV (/content/trainLabels.csv).",
    "modelType": "6 conv custom CNN",
    "optimizer": "Adam (ExponentialDecay)",
    "loss": "categorical_crossentropy",
    "epochs": "15",
    "batchSize": "32",
    "seed": "10",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(128, 128, 3)",
        "kind": "input"
      },
      {
        "name": "Augmentation",
        "detail": "Rotate, Translate, Zoom, Flip",
        "kind": "aug"
      },
      {
        "name": "2x Conv2D(32) + Pool",
        "detail": "3x3 relu + Dropout(0.25)",
        "kind": "conv"
      },
      {
        "name": "2x Conv2D(64) + Pool",
        "detail": "3x3 relu + Dropout(0.25)",
        "kind": "conv"
      },
      {
        "name": "2x Conv2D(64) + Pool",
        "detail": "3x3 relu + Dropout(0.25)",
        "kind": "conv"
      },
      {
        "name": "Dense(512) -> Dense(5)",
        "detail": "Dropout(0.5) + softmax",
        "kind": "output"
      }
    ],
    "highlights": [
      "Splits by PatientID so left and right eyes of the same patient never cross sets.",
      "Builds a cached tf.data pipeline with parallel decoding and AUTOTUNE prefetching.",
      "Decays learning rate exponentially per epoch from 1e-3 at rate 0.95."
    ],
    "code": "# Ex-7  Diabetic Retinopathy detection (5-class CNN on retinal images)\nimport os\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport tensorflow as tf\nimport keras\nfrom keras import layers\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import classification_report\n\n# ---- Set these paths (Kaggle \"Diabetic Retinopathy Detection\": images + trainLabels.csv) ----\nIMG_DIR = \"/content/dr_images\"             # folder containing the .jpeg retina images\nLABELS_CSV = \"/content/trainLabels.csv\"    # columns: image, level\nWIDTH = HEIGHT = 128\nNUM_CLASSES, EPOCHS, BS, INIT_LR = 5, 15, 32, 1e-3\nCLASS_NAMES = [\"No DR\", \"Mild\", \"Moderate\", \"Severe\", \"Proliferative DR\"]\nkeras.utils.set_random_seed(10)\n\n# 1. Read labels, keep only the images that are actually on disk (works with the 1000-image sample)\ndf = pd.read_csv(LABELS_CSV)\ndf[\"path\"] = df[\"image\"].apply(lambda n: os.path.join(IMG_DIR, n + \".jpeg\"))\ndf = df[df[\"path\"].apply(os.path.exists)].reset_index(drop=True)\ndf[\"PatientID\"] = df[\"image\"].str.replace(r\"_(left|right)$\", \"\", regex=True)\nprint(len(df), \"images from\", df[\"PatientID\"].nunique(), \"patients\")\nprint(df[\"level\"].value_counts().sort_index().rename(dict(enumerate(CLASS_NAMES))))\n\n# 2. Split BY PATIENT 75:25 so both eyes of a patient never sit in different sets\ntrain_ids, val_ids = train_test_split(df[\"PatientID\"].unique(), test_size=0.25, random_state=10)\ntrain_df = df[df[\"PatientID\"].isin(train_ids)].reset_index(drop=True)\nval_df = df[df[\"PatientID\"].isin(val_ids)].reset_index(drop=True)\nprint(\"train:\", len(train_df), \"| validation:\", len(val_df))\n\n# 3. tf.data pipeline: read -> resize -> scale to [0, 1] -> one-hot\ndef load(path, label):\n    img = tf.io.read_file(path)\n    img = tf.image.decode_jpeg(img, channels=3)\n    img = tf.image.resize(img, (HEIGHT, WIDTH)) / 255.0\n    return img, tf.one_hot(label, NUM_CLASSES)\n\ndef make_ds(frame, shuffle):\n    ds = tf.data.Dataset.from_tensor_slices((frame[\"path\"].values, frame[\"level\"].values.astype(\"int32\")))\n    ds = ds.map(load, num_parallel_calls=tf.data.AUTOTUNE).cache()\n    if shuffle:\n        ds = ds.shuffle(len(frame), seed=10)\n    return ds.batch(BS).prefetch(tf.data.AUTOTUNE)\n\ntrain_ds, val_ds = make_ds(train_df, True), make_ds(val_df, False)\n\n# 4. CNN with built-in augmentation (active only while training)\nmodel = keras.Sequential([\n    keras.Input(shape=(HEIGHT, WIDTH, 3)),\n    layers.RandomRotation(30 / 360), layers.RandomTranslation(0.1, 0.1),\n    layers.RandomZoom(0.2), layers.RandomFlip(\"horizontal\"),\n\n    layers.Conv2D(32, 3, padding=\"same\", activation=\"relu\"),\n    layers.Conv2D(32, 3, activation=\"relu\"),\n    layers.MaxPooling2D(2), layers.Dropout(0.25),\n\n    layers.Conv2D(64, 3, padding=\"same\", activation=\"relu\"),\n    layers.Conv2D(64, 3, activation=\"relu\"),\n    layers.MaxPooling2D(2), layers.Dropout(0.25),\n\n    layers.Conv2D(64, 3, padding=\"same\", activation=\"relu\"),\n    layers.Conv2D(64, 3, activation=\"relu\"),\n    layers.MaxPooling2D(2), layers.Dropout(0.25),\n\n    layers.Flatten(),\n    layers.Dense(512, activation=\"relu\"), layers.Dropout(0.5),\n    layers.Dense(NUM_CLASSES, activation=\"softmax\"),\n])\nsteps = max(1, len(train_df) // BS)\nlr = keras.optimizers.schedules.ExponentialDecay(INIT_LR, decay_steps=steps, decay_rate=0.95)\nmodel.compile(loss=\"categorical_crossentropy\", optimizer=keras.optimizers.Adam(lr), metrics=[\"accuracy\"])\nmodel.summary()\n\n# 5. Train, save, plot\nH = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS, verbose=1)\nmodel.save(\"dr_model.keras\")\n\nplt.style.use(\"ggplot\")\nplt.figure()\nfor k in [\"loss\", \"val_loss\", \"accuracy\", \"val_accuracy\"]:\n    plt.plot(H.history[k], label=k)\nplt.title(\"Training loss and accuracy: diabetic retinopathy detection\")\nplt.xlabel(\"Epoch #\"); plt.ylabel(\"Loss / Accuracy\"); plt.legend(loc=\"lower left\")\nplt.savefig(\"plot.png\"); plt.show()\n\n# 6. Evaluate\ny_true = np.concatenate([np.argmax(l.numpy(), axis=1) for _, l in val_ds])\ny_pred = np.argmax(model.predict(val_ds, verbose=0), axis=1)\nprint(classification_report(y_true, y_pred, labels=range(NUM_CLASSES),\n                            target_names=CLASS_NAMES, zero_division=0))",
    "lineCount": 93
  },
  {
    "id": "ex-08",
    "codeLabel": "Ex 08",
    "title": "Different optimizers",
    "aim": "Train the same network with 8 optimizers, compare validation curves, and pick the best.",
    "category": "Regularization & Optimizers",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "Wine Quality Red (UCI)",
    "datasetSetup": "Auto download",
    "datasetNotes": "Splits 64% train, 16% validation, 20% test with StandardScaler fit on train only.",
    "modelType": "5 layer Dense regressor",
    "optimizer": "8 optimizers benchmarked",
    "loss": "mse",
    "epochs": "300 max (EarlyStopping)",
    "batchSize": "128",
    "seed": "2022",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(11,)",
        "kind": "input"
      },
      {
        "name": "Dense(100) -> Dense(50)",
        "detail": "activation=relu",
        "kind": "dense"
      },
      {
        "name": "Dense(25) -> Dense(10)",
        "detail": "activation=relu",
        "kind": "dense"
      },
      {
        "name": "Dense(1)",
        "detail": "activation=linear",
        "kind": "output"
      }
    ],
    "highlights": [
      "Resets random seed and creates a fresh optimizer instance for each of 8 runs.",
      "Tests SGD, SGD 1e-4, Adam, Adadelta, RMSprop, RMSprop 1e-4, Nadam, and Adamax.",
      "Ranks all runs by test MSE and displays validation loss curves side by side."
    ],
    "code": "# Ex-8  Compare different optimizers (Wine Quality regression)\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nSEED = 2022\nkeras.utils.set_random_seed(SEED)\n\ndef load_wine():\n    urls = [\"https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv\",\n            \"https://raw.githubusercontent.com/shrikant-temburwar/Wine-Quality-Dataset/master/winequality-red.csv\"]\n    for u in urls:\n        try:\n            return pd.read_csv(u, sep=\";\")\n        except Exception as e:\n            print(\"could not read\", u, \"->\", type(e).__name__)\n    raise RuntimeError(\"Wine data not reachable\")\n\ndata = load_wine()\ny = data[\"quality\"].values.astype(\"float32\")\nX = data.drop([\"quality\"], axis=1)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED)\nX_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=SEED)\n\nscaler = StandardScaler().fit(X_train)            # scale: unscaled wine data makes SGD diverge\nX_train, X_val, X_test = [scaler.transform(a).astype(\"float32\") for a in (X_train, X_val, X_test)]\nprint(\"NaN/inf in data:\", any(not np.isfinite(a).all() for a in (X_train, X_val, X_test, y_train, y_val, y_test)))\n\ndef create_model():\n    return keras.Sequential([\n        keras.Input(shape=(X_train.shape[1],)),\n        layers.Dense(100, activation=\"relu\"), layers.Dense(50, activation=\"relu\"),\n        layers.Dense(25, activation=\"relu\"), layers.Dense(10, activation=\"relu\"),\n        layers.Dense(1, activation=\"linear\"),\n    ])\n\n# A fresh optimizer object for every run\nopts = {\n    \"sgd\":          lambda: keras.optimizers.SGD(),\n    \"sgd-0001\":     lambda: keras.optimizers.SGD(learning_rate=1e-4),\n    \"adam\":         lambda: keras.optimizers.Adam(),\n    \"adadelta\":     lambda: keras.optimizers.Adadelta(),\n    \"rmsprop\":      lambda: keras.optimizers.RMSprop(),\n    \"rmsprop-0001\": lambda: keras.optimizers.RMSprop(learning_rate=1e-4),\n    \"nadam\":        lambda: keras.optimizers.Nadam(),\n    \"adamax\":       lambda: keras.optimizers.Adamax(),\n}\n\nBATCH, MAX_EPOCHS = 128, 300\nresults, curves = [], {}\nfor name, make_opt in opts.items():\n    keras.utils.set_random_seed(SEED)\n    model = create_model()\n    model.compile(loss=\"mse\", optimizer=make_opt())\n    stop = keras.callbacks.EarlyStopping(monitor=\"val_loss\", patience=30, restore_best_weights=True)\n    hist = model.fit(X_train, y_train, batch_size=BATCH, epochs=MAX_EPOCHS,\n                     validation_data=(X_val, y_val), callbacks=[stop], verbose=0)\n    best_epoch = int(np.argmin(hist.history[\"val_loss\"]))\n    test_mse = float(model.evaluate(X_test, y_test, verbose=0))\n    test_acc = float(np.mean(np.round(model.predict(X_test, verbose=0).ravel()) == y_test))\n    results.append([name, best_epoch + 1, hist.history[\"val_loss\"][best_epoch], test_mse, test_acc])\n    curves[name] = hist.history[\"val_loss\"]\n    print(f\"{name:<13} best epoch {best_epoch + 1:>3} | val MSE {results[-1][2]:.4f} | test MSE {test_mse:.4f}\")\n\nres = pd.DataFrame(results, columns=[\"optimizer\", \"best_epoch\", \"val_mse\", \"test_mse\", \"test_rounded_acc\"])\nprint(\"\\n\", res.sort_values(\"test_mse\").to_string(index=False))\nprint(\"\\nBest optimizer (lowest test MSE):\", res.loc[res[\"test_mse\"].idxmin(), \"optimizer\"])\n\nplt.figure(figsize=(9, 5))\nfor name, v in curves.items():\n    plt.plot(v, label=name)\nplt.ylim(0, 2); plt.xlabel(\"epochs\"); plt.ylabel(\"validation MSE\")\nplt.title(\"Optimizer comparison\"); plt.legend(); plt.show()",
    "lineCount": 78
  },
  {
    "id": "ex-09",
    "codeLabel": "Ex 09",
    "title": "Improving generalisation with regularisation",
    "aim": "Reduce overfitting on hourly Bike Sharing data with L2 weight regularisation.",
    "category": "Regularization & Optimizers",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "Bike Sharing Hourly (UCI)",
    "datasetSetup": "Auto download or CSV upload",
    "datasetNotes": "Downloads zip automatically from UCI; prompts Colab upload of hour.csv if blocked.",
    "modelType": "Dense MLP with L2 penalty",
    "optimizer": "SGD",
    "loss": "mse",
    "epochs": "2000",
    "batchSize": "1024",
    "seed": "2022",
    "layers": [
      {
        "name": "Input",
        "detail": "one hot + scaled features",
        "kind": "input"
      },
      {
        "name": "Dense(250)",
        "detail": "relu, optional L2(0.005)",
        "kind": "dense"
      },
      {
        "name": "Dense(150) -> Dense(50)",
        "detail": "activation=relu",
        "kind": "dense"
      },
      {
        "name": "Dense(25)",
        "detail": "relu, optional L2(0.005)",
        "kind": "dense"
      },
      {
        "name": "Dense(1)",
        "detail": "activation=linear",
        "kind": "output"
      }
    ],
    "highlights": [
      "Uses chronological split: final 31 days for test, preceding 30 days for validation.",
      "Applies L2=0.005 regularizer to outer hidden layers while holding seed constant.",
      "Plots training and validation loss curves side by side on a shared y axis."
    ],
    "code": "# Ex-9  Improving generalisation with L2 regularisation (Bike Sharing, hourly)\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\n\nkeras.utils.set_random_seed(2022)\n\nimport os, io, zipfile, urllib.request\n\ndef load_bike():\n    if os.path.exists(\"hour.csv\"):\n        return pd.read_csv(\"hour.csv\")\n    url = \"https://archive.ics.uci.edu/static/public/275/bike+sharing+dataset.zip\"\n    try:\n        raw = urllib.request.urlopen(url, timeout=60).read()\n        with zipfile.ZipFile(io.BytesIO(raw)) as z:\n            return pd.read_csv(z.open(\"hour.csv\"))\n    except Exception as e:\n        print(\"download failed:\", type(e).__name__, \"- upload hour.csv from the UCI Bike Sharing dataset\")\n        from google.colab import files        # Colab only\n        files.upload()\n        return pd.read_csv(\"hour.csv\")\n\ndef prepare_bike(data):\n    ohe_features = [\"season\", \"weathersit\", \"mnth\", \"hr\", \"weekday\"]\n    for f in ohe_features:\n        data = pd.concat([data, pd.get_dummies(data[f], prefix=f, drop_first=False, dtype=float)], axis=1)\n    drop = [\"instant\", \"dteday\", \"season\", \"weathersit\", \"weekday\", \"atemp\", \"mnth\",\n            \"workingday\", \"hr\", \"casual\", \"registered\"]\n    data = data.drop(drop, axis=1)\n    for f in [\"cnt\", \"temp\", \"hum\", \"windspeed\"]:                 # standardise\n        data[f] = (data[f] - data[f].mean()) / data[f].std()\n    test_data, data = data[-31 * 24:], data[:-31 * 24]            # last month = test (744 rows)\n    feats, targ = data.drop([\"cnt\"], axis=1), data[\"cnt\"]\n    X_train, y_train = feats[:-30 * 24], targ[:-30 * 24]          # last 30 days of the rest = validation\n    X_val, y_val = feats[-30 * 24:], targ[-30 * 24:]\n    X_test, y_test = test_data.drop([\"cnt\"], axis=1), test_data[\"cnt\"]\n    f32 = lambda a: a.values.astype(\"float32\")\n    return f32(X_train), f32(y_train), f32(X_val), f32(y_val), f32(X_test), f32(y_test)\n\nX_train, y_train, X_val, y_val, X_test, y_test = prepare_bike(load_bike())\nprint(\"train\", X_train.shape, \"| validation\", X_val.shape, \"| test\", X_test.shape)\n\nN_EPOCHS, BATCH = 2000, 1024          # the manual uses 4000 epochs; 2000 shows the same behaviour faster\n\ndef build(l2=None):\n    reg = keras.regularizers.l2(l2) if l2 else None\n    m = keras.Sequential([\n        keras.Input(shape=(X_train.shape[1],)),\n        layers.Dense(250, activation=\"relu\", kernel_regularizer=reg),\n        layers.Dense(150, activation=\"relu\"),\n        layers.Dense(50, activation=\"relu\"),\n        layers.Dense(25, activation=\"relu\", kernel_regularizer=reg),\n        layers.Dense(1, activation=\"linear\"),\n    ])\n    m.compile(loss=\"mse\", optimizer=\"sgd\", metrics=[\"mse\"])\n    return m\n\nruns = {}\nfor name, l2 in [(\"no regularisation\", None), (\"L2 = 0.005\", 0.005)]:\n    keras.utils.set_random_seed(2022)\n    h = build(l2).fit(X_train, y_train, validation_data=(X_val, y_val),\n                      batch_size=BATCH, epochs=N_EPOCHS, verbose=0)\n    runs[name] = h.history\n    print(f\"{name:<18} min validation loss: {min(h.history['val_loss']):.4f} \"\n          f\"after {int(np.argmin(h.history['val_loss'])) + 1} epochs | \"\n          f\"final validation loss: {h.history['val_loss'][-1]:.4f}\")\n\nfig, ax = plt.subplots(1, 2, figsize=(13, 4), sharey=True)\nfor a, (name, h) in zip(ax, runs.items()):\n    a.plot(h[\"loss\"], label=\"training\"); a.plot(h[\"val_loss\"], label=\"validation\")\n    a.set_title(name); a.set_xlabel(\"epochs\"); a.legend()\nax[0].set_ylabel(\"loss\"); plt.tight_layout(); plt.show()",
    "lineCount": 75
  },
  {
    "id": "ex-10",
    "codeLabel": "Ex 10",
    "title": "Dropout to prevent overfitting",
    "aim": "Reduce overfitting on hourly Bike Sharing data by inserting Dropout layers.",
    "category": "Regularization & Optimizers",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "Bike Sharing Hourly (UCI)",
    "datasetSetup": "Auto download or CSV upload",
    "datasetNotes": "Downloads zip automatically from UCI; prompts Colab upload of hour.csv if blocked.",
    "modelType": "Dense MLP with Dropout(0.20)",
    "optimizer": "SGD",
    "loss": "mse",
    "epochs": "2000",
    "batchSize": "1024",
    "seed": "2022",
    "layers": [
      {
        "name": "Input",
        "detail": "one hot + scaled features",
        "kind": "input"
      },
      {
        "name": "4x [Dense -> Dropout]",
        "detail": "250, 150, 50, 25 + rate=0.20",
        "kind": "dense"
      },
      {
        "name": "Dense(1)",
        "detail": "activation=linear",
        "kind": "output"
      }
    ],
    "highlights": [
      "Compares zero dropout baseline against Dropout(0.20) after every hidden layer.",
      "Evaluates held out test month MSE after 2000 full epochs.",
      "Verifies dropout applies only during training while inference stays deterministic."
    ],
    "code": "# Ex-10  Adding dropout to prevent overfitting (Bike Sharing, hourly)\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\n\nkeras.utils.set_random_seed(2022)\n\nimport os, io, zipfile, urllib.request\n\ndef load_bike():\n    if os.path.exists(\"hour.csv\"):\n        return pd.read_csv(\"hour.csv\")\n    url = \"https://archive.ics.uci.edu/static/public/275/bike+sharing+dataset.zip\"\n    try:\n        raw = urllib.request.urlopen(url, timeout=60).read()\n        with zipfile.ZipFile(io.BytesIO(raw)) as z:\n            return pd.read_csv(z.open(\"hour.csv\"))\n    except Exception as e:\n        print(\"download failed:\", type(e).__name__, \"- upload hour.csv from the UCI Bike Sharing dataset\")\n        from google.colab import files        # Colab only\n        files.upload()\n        return pd.read_csv(\"hour.csv\")\n\ndef prepare_bike(data):\n    ohe_features = [\"season\", \"weathersit\", \"mnth\", \"hr\", \"weekday\"]\n    for f in ohe_features:\n        data = pd.concat([data, pd.get_dummies(data[f], prefix=f, drop_first=False, dtype=float)], axis=1)\n    drop = [\"instant\", \"dteday\", \"season\", \"weathersit\", \"weekday\", \"atemp\", \"mnth\",\n            \"workingday\", \"hr\", \"casual\", \"registered\"]\n    data = data.drop(drop, axis=1)\n    for f in [\"cnt\", \"temp\", \"hum\", \"windspeed\"]:                 # standardise\n        data[f] = (data[f] - data[f].mean()) / data[f].std()\n    test_data, data = data[-31 * 24:], data[:-31 * 24]            # last month = test (744 rows)\n    feats, targ = data.drop([\"cnt\"], axis=1), data[\"cnt\"]\n    X_train, y_train = feats[:-30 * 24], targ[:-30 * 24]          # last 30 days of the rest = validation\n    X_val, y_val = feats[-30 * 24:], targ[-30 * 24:]\n    X_test, y_test = test_data.drop([\"cnt\"], axis=1), test_data[\"cnt\"]\n    f32 = lambda a: a.values.astype(\"float32\")\n    return f32(X_train), f32(y_train), f32(X_val), f32(y_val), f32(X_test), f32(y_test)\n\nX_train, y_train, X_val, y_val, X_test, y_test = prepare_bike(load_bike())\nprint(\"train\", X_train.shape, \"| validation\", X_val.shape, \"| test\", X_test.shape)\n\nN_EPOCHS, BATCH, RATE = 2000, 1024, 0.20\n\ndef build(dropout=0.0):\n    m = keras.Sequential([keras.Input(shape=(X_train.shape[1],))])\n    for units in [250, 150, 50, 25]:\n        m.add(layers.Dense(units, activation=\"relu\"))\n        if dropout:\n            m.add(layers.Dropout(dropout))      # randomly zeroes units during training only\n    m.add(layers.Dense(1, activation=\"linear\"))\n    m.compile(loss=\"mse\", optimizer=\"sgd\", metrics=[\"mse\"])\n    return m\n\nruns = {}\nfor name, rate in [(\"no dropout\", 0.0), (f\"dropout {RATE}\", RATE)]:\n    keras.utils.set_random_seed(2022)\n    model = build(rate)\n    h = model.fit(X_train, y_train, validation_data=(X_val, y_val),\n                  batch_size=BATCH, epochs=N_EPOCHS, verbose=0)\n    runs[name] = h.history\n    test_mse = model.evaluate(X_test, y_test, verbose=0)[0]\n    print(f\"{name:<14} min validation loss: {min(h.history['val_loss']):.4f} \"\n          f\"after {int(np.argmin(h.history['val_loss'])) + 1} epochs | test MSE: {test_mse:.4f}\")\n\nmodel.summary()\n\nfig, ax = plt.subplots(1, 2, figsize=(13, 4), sharey=True)\nfor a, (name, h) in zip(ax, runs.items()):\n    a.plot(h[\"loss\"], label=\"training\"); a.plot(h[\"val_loss\"], label=\"validation\")\n    a.set_title(name); a.set_xlabel(\"epochs\"); a.legend()\nax[0].set_ylabel(\"loss\"); plt.tight_layout(); plt.show()",
    "lineCount": 75
  },
  {
    "id": "ex-11",
    "codeLabel": "Ex 11",
    "title": "Image augmentation",
    "aim": "Apply resizing, flips, rotation, brightness, contrast, crop, and custom inversion.",
    "category": "CNNs & Vision",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "TF Flowers (TFDS)",
    "datasetSetup": "Auto download",
    "datasetNotes": "Streams via tensorflow_datasets (80% train, 10% validation, 10% test).",
    "modelType": "Preprocessing & tf.image pipeline",
    "optimizer": "Pipeline only",
    "loss": "Pipeline only",
    "epochs": "Pipeline demo",
    "batchSize": "32",
    "seed": "Stateless (0..2)",
    "layers": [
      {
        "name": "Resizing + Rescaling",
        "detail": "180x180, scale 1/255",
        "kind": "aug"
      },
      {
        "name": "RandomFlip + Rotate",
        "detail": "horizontal_and_vertical, 0.4",
        "kind": "aug"
      },
      {
        "name": "Custom Invert",
        "detail": "tf.cond p=0.5 inversion",
        "kind": "aug"
      },
      {
        "name": "tf.image Transforms",
        "detail": "saturation, brightness, crop",
        "kind": "aug"
      }
    ],
    "highlights": [
      "Demonstrates Keras preprocessing layers alongside deterministic and stateless tf.image ops.",
      "Builds a training only augmented tf.data pipeline prefetched with AUTOTUNE.",
      "Verifies output batch tensor shape and normalized pixel value range."
    ],
    "code": "# Ex-11  Image augmentation with Keras preprocessing layers and tf.image\nimport matplotlib.pyplot as plt\nimport tensorflow as tf\nimport tensorflow_datasets as tfds      # Colab: already installed\nimport keras\nfrom keras import layers\n\n# 1. Load the TF Flowers dataset and pick an image\n(train_ds, val_ds, test_ds), metadata = tfds.load(\n    \"tf_flowers\", split=[\"train[:80%]\", \"train[80%:90%]\", \"train[90%:]\"],\n    with_info=True, as_supervised=True)\nget_label_name = metadata.features[\"label\"].int2str\n\nfig = plt.figure(figsize=(14, 3))\nfor i, (img, lab) in enumerate(train_ds.take(6)):\n    fig.add_subplot(1, 6, i + 1); plt.imshow(img); plt.axis(\"off\"); plt.title(get_label_name(lab))\nplt.show()\n\nimage, label = next(iter(train_ds))\nprint(\"Image shape:\", image.shape, \"| label:\", get_label_name(label))\n\ndef visualize(original, augmented, title=\"Augmented image\"):\n    plt.figure(figsize=(7, 3))\n    plt.subplot(1, 2, 1); plt.title(\"Original image\"); plt.imshow(original); plt.axis(\"off\")\n    plt.subplot(1, 2, 2); plt.title(title); plt.imshow(augmented); plt.axis(\"off\")\n    plt.show()\n\n# 2. Resize and rescale\nIMG_SIZE = 180\nresize_and_rescale = keras.Sequential([layers.Resizing(IMG_SIZE, IMG_SIZE), layers.Rescaling(1. / 255)])\nresult = resize_and_rescale(tf.cast(image, tf.float32))\nplt.imshow(result); plt.axis(\"off\"); plt.title(\"Resized + rescaled\"); plt.show()\n\n# 3. Random flip + rotation (random layers only act when training=True)\ndata_augmentation = keras.Sequential([layers.RandomFlip(\"horizontal_and_vertical\"), layers.RandomRotation(0.4)])\nplt.figure(figsize=(8, 5))\nfor i in range(6):\n    aug = data_augmentation(tf.expand_dims(tf.cast(image, tf.float32) / 255., 0), training=True)\n    plt.subplot(2, 3, i + 1); plt.imshow(aug[0]); plt.axis(\"off\")\nplt.suptitle(\"RandomFlip + RandomRotation\"); plt.show()\n\n# 4. Custom augmentation: random colour inversion\ndef random_invert_img(x, p=0.5):\n    return tf.cond(tf.random.uniform([]) < p, lambda: 255 - x, lambda: x)\n\nimg_f = tf.cast(image, tf.float32)\nplt.figure(figsize=(8, 8))\nfor i in range(9):\n    plt.subplot(3, 3, i + 1); plt.imshow(tf.cast(random_invert_img(img_f), tf.uint8)); plt.axis(\"off\")\nplt.suptitle(\"Random invert\"); plt.show()\n\n# 5. Deterministic and stateless-random tf.image operations\nvisualize(image, tf.image.flip_left_right(image), \"Flipped\")\ngray = tf.image.rgb_to_grayscale(image)\nvisualize(image, tf.squeeze(gray), \"Grayscale\"); \nvisualize(image, tf.image.adjust_saturation(image, 4), \"Saturation x4\")\nvisualize(image, tf.image.adjust_brightness(image, 0.4), \"Brightness +0.4\")\nvisualize(image, tf.image.central_crop(image, central_fraction=0.5), \"Central crop 50%\")\nvisualize(image, tf.image.rot90(image), \"Rotated 90\")\n\nh, w = int(image.shape[0] * 0.7), int(image.shape[1] * 0.7)\nfor i in range(3):\n    seed = (i, 0)\n    visualize(image, tf.image.stateless_random_brightness(image, max_delta=0.95, seed=seed), f\"Random brightness (seed {i})\")\n    visualize(image, tf.image.stateless_random_contrast(image, lower=0.1, upper=0.9, seed=seed), f\"Random contrast (seed {i})\")\n    visualize(image, tf.image.stateless_random_crop(image, size=[h, w, 3], seed=seed), f\"Random crop (seed {i})\")\n\n# 6. Use augmentation in a real input pipeline (training set only)\ndef prepare(ds, augment=False, batch=32):\n    ds = ds.map(lambda x, y: (resize_and_rescale(tf.cast(x, tf.float32)), y), num_parallel_calls=tf.data.AUTOTUNE)\n    ds = ds.batch(batch)\n    if augment:\n        ds = ds.map(lambda x, y: (data_augmentation(x, training=True), y), num_parallel_calls=tf.data.AUTOTUNE)\n    return ds.prefetch(tf.data.AUTOTUNE)\n\ntrain_aug = prepare(train_ds, augment=True)\nxb, yb = next(iter(train_aug))\nprint(\"Augmented training batch:\", xb.shape, \"pixel range\", float(tf.reduce_min(xb)), \"to\", float(tf.reduce_max(xb)))",
    "lineCount": 78
  },
  {
    "id": "ex-12a",
    "codeLabel": "Ex 12a",
    "title": "LeNet 5",
    "aim": "Implement the classic LeNet 5 convolutional network trained on MNIST digits.",
    "category": "CNNs & Vision",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "MNIST (28x28x1)",
    "datasetSetup": "Built in",
    "datasetNotes": "Expands grayscale channel axis to shape (28, 28, 1) and normalizes to [0, 1].",
    "modelType": "LeNet 5 CNN",
    "optimizer": "Adam",
    "loss": "sparse_categorical_crossentropy",
    "epochs": "5",
    "batchSize": "32",
    "seed": "42",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(28, 28, 1)",
        "kind": "input"
      },
      {
        "name": "C1: Conv2D(6, 5x5)",
        "detail": "tanh, padding=same",
        "kind": "conv"
      },
      {
        "name": "S2: AvgPool2D(2)",
        "detail": "2x2 average pooling",
        "kind": "pool"
      },
      {
        "name": "C3: Conv2D(16, 5x5)",
        "detail": "tanh, padding=valid",
        "kind": "conv"
      },
      {
        "name": "S4: AvgPool2D(2)",
        "detail": "2x2 average pooling",
        "kind": "pool"
      },
      {
        "name": "C5: Conv2D(120, 5x5)",
        "detail": "tanh -> Flatten()",
        "kind": "conv"
      },
      {
        "name": "F6: Dense(84) -> Out(10)",
        "detail": "tanh -> softmax",
        "kind": "output"
      }
    ],
    "highlights": [
      "Follows classical C1 S2 C3 S4 C5 F6 output topology with tanh activations.",
      "Uses first 5000 training images as validation data during 5 epochs.",
      "Displays 10 test digits annotated with predicted vs ground truth labels."
    ],
    "code": "# Ex-12(a)  LeNet-5 (the manual runs it on MNIST)\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\n\nkeras.utils.set_random_seed(42)\n\n# 1. Data: normalise and add the channel axis -> (28, 28, 1)\n(train_x, train_y), (test_x, test_y) = keras.datasets.mnist.load_data()\ntrain_x = np.expand_dims(train_x.astype(\"float32\") / 255.0, -1)\ntest_x = np.expand_dims(test_x.astype(\"float32\") / 255.0, -1)\nval_x, val_y = train_x[:5000], train_y[:5000]\n\n# 2. LeNet-5: C1 - S2 - C3 - S4 - C5 - F6 - output\nlenet = keras.Sequential([\n    keras.Input(shape=(28, 28, 1)),\n    layers.Conv2D(6, kernel_size=5, strides=1, activation=\"tanh\", padding=\"same\"),   # C1\n    layers.AveragePooling2D(pool_size=2),                                                      # S2\n    layers.Conv2D(16, kernel_size=5, strides=1, activation=\"tanh\", padding=\"valid\"),  # C3\n    layers.AveragePooling2D(pool_size=2),                                                      # S4\n    layers.Conv2D(120, kernel_size=5, strides=1, activation=\"tanh\", padding=\"valid\"), # C5\n    layers.Flatten(),\n    layers.Dense(84, activation=\"tanh\"),                                              # F6\n    layers.Dense(10, activation=\"softmax\"),                                           # output\n])\nlenet.compile(optimizer=\"adam\", loss=\"sparse_categorical_crossentropy\", metrics=[\"accuracy\"])\nlenet.summary()\n\n# 3. Train and evaluate\nhistory = lenet.fit(train_x, train_y, epochs=5, validation_data=(val_x, val_y))\ntest_loss, test_acc = lenet.evaluate(test_x, test_y, verbose=0)\nprint(f\"Test loss: {test_loss:.4f} | Test accuracy: {test_acc:.4f}\")\n\n# 4. Curves and a few predictions\nfig, ax = plt.subplots(1, 2, figsize=(11, 4))\nax[0].plot(history.history[\"accuracy\"], label=\"train\"); ax[0].plot(history.history[\"val_accuracy\"], label=\"val\")\nax[0].set_title(\"Accuracy\"); ax[0].set_xlabel(\"epochs\"); ax[0].legend()\nax[1].plot(history.history[\"loss\"], label=\"train\"); ax[1].plot(history.history[\"val_loss\"], label=\"val\")\nax[1].set_title(\"Loss\"); ax[1].set_xlabel(\"epochs\"); ax[1].legend()\nplt.show()\n\npred = np.argmax(lenet.predict(test_x[:10], verbose=0), axis=1)\nplt.figure(figsize=(12, 2))\nfor i in range(10):\n    plt.subplot(1, 10, i + 1); plt.imshow(test_x[i, :, :, 0], cmap=\"gray\"); plt.axis(\"off\")\n    plt.title(f\"{pred[i]} ({test_y[i]})\", fontsize=8)\nplt.suptitle(\"Predicted (true)\"); plt.show()",
    "lineCount": 48
  },
  {
    "id": "ex-12b",
    "codeLabel": "Ex 12b",
    "title": "AlexNet",
    "aim": "Implement AlexNet trained on CIFAR 10 images resized to 227x227 with TensorBoard.",
    "category": "CNNs & Vision",
    "runtime": "GPU Recommended",
    "gpuRequired": true,
    "datasetName": "CIFAR 10 (227x227x3)",
    "datasetSetup": "Built in",
    "datasetNotes": "Applies per image standardization and resizes 32x32 CIFAR 10 images to 227x227.",
    "modelType": "AlexNet 8 layer CNN",
    "optimizer": "SGD (lr=0.001, m=0.9)",
    "loss": "sparse_categorical_crossentropy",
    "epochs": "5",
    "batchSize": "32",
    "seed": "42",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(227, 227, 3)",
        "kind": "input"
      },
      {
        "name": "Conv2D(96, 11x11, s=4)",
        "detail": "BatchNorm + MaxPool(3, s=2)",
        "kind": "conv"
      },
      {
        "name": "Conv2D(256, 5x5, same)",
        "detail": "BatchNorm + MaxPool(3, s=2)",
        "kind": "conv"
      },
      {
        "name": "Conv2D(384, 384, 256)",
        "detail": "3x3 same + BatchNorm + Pool",
        "kind": "conv"
      },
      {
        "name": "2x Dense(4096)",
        "detail": "relu + Dropout(0.5)",
        "kind": "dense"
      },
      {
        "name": "Dense(10)",
        "detail": "activation=softmax",
        "kind": "output"
      }
    ],
    "highlights": [
      "Includes BatchNormalization after every convolutional layer for stable convergence.",
      "Streams tf.data pipelines with drop_remainder=True and TensorBoard logging.",
      "Rescales standardized tensors back to [0, 1] when previewing 8 test predictions."
    ],
    "code": "# Ex-12(b)  AlexNet (the manual trains it on CIFAR-10 resized to 227x227). Use a GPU runtime.\nimport os, time\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport tensorflow as tf\nimport keras\nfrom keras import layers\n\nkeras.utils.set_random_seed(42)\nCLASS_NAMES = [\"airplane\", \"automobile\", \"bird\", \"cat\", \"deer\", \"dog\", \"frog\", \"horse\", \"ship\", \"truck\"]\n\n# 1. Data: hold out 5000 training images for validation\n(train_images, train_labels), (test_images, test_labels) = keras.datasets.cifar10.load_data()\nval_images, val_labels = train_images[:5000], train_labels[:5000]\ntrain_images, train_labels = train_images[5000:], train_labels[5000:]\n\nplt.figure(figsize=(12, 3))\nfor i in range(5):\n    plt.subplot(1, 5, i + 1); plt.imshow(train_images[i]); plt.axis(\"off\"); plt.title(CLASS_NAMES[int(train_labels[i][0])])\nplt.show()\n\ndef process_images(image, label):\n    image = tf.image.per_image_standardization(tf.cast(image, tf.float32))   # mean 0, std 1\n    image = tf.image.resize(image, (227, 227))                                # AlexNet input size\n    return image, tf.squeeze(label)\n\ndef make_ds(x, y, shuffle):\n    ds = tf.data.Dataset.from_tensor_slices((x, y))\n    if shuffle:\n        ds = ds.shuffle(len(x), seed=42)\n    return ds.map(process_images, num_parallel_calls=tf.data.AUTOTUNE).batch(32, drop_remainder=True).prefetch(tf.data.AUTOTUNE)\n\ntrain_ds = make_ds(train_images, train_labels, True)\nvalidation_ds = make_ds(val_images, val_labels, False)\ntest_ds = make_ds(test_images, test_labels, False)\nprint(\"train / val / test images:\", len(train_images), len(val_images), len(test_images))\n\n# 2. AlexNet: 5 conv layers + 3 dense layers, with BatchNorm and Dropout\nmodel = keras.Sequential([\n    keras.Input(shape=(227, 227, 3)),\n    layers.Conv2D(96, (11, 11), strides=(4, 4), activation=\"relu\"),\n    layers.BatchNormalization(), layers.MaxPool2D((3, 3), strides=(2, 2)),\n    layers.Conv2D(256, (5, 5), padding=\"same\", activation=\"relu\"),\n    layers.BatchNormalization(), layers.MaxPool2D((3, 3), strides=(2, 2)),\n    layers.Conv2D(384, (3, 3), padding=\"same\", activation=\"relu\"), layers.BatchNormalization(),\n    layers.Conv2D(384, (3, 3), padding=\"same\", activation=\"relu\"), layers.BatchNormalization(),\n    layers.Conv2D(256, (3, 3), padding=\"same\", activation=\"relu\"), layers.BatchNormalization(),\n    layers.MaxPool2D((3, 3), strides=(2, 2)),\n    layers.Flatten(),\n    layers.Dense(4096, activation=\"relu\"), layers.Dropout(0.5),\n    layers.Dense(4096, activation=\"relu\"), layers.Dropout(0.5),\n    layers.Dense(10, activation=\"softmax\"),\n])\nmodel.compile(loss=\"sparse_categorical_crossentropy\",\n              optimizer=keras.optimizers.SGD(learning_rate=0.001, momentum=0.9), metrics=[\"accuracy\"])\nmodel.summary()\n\n# 3. Train with TensorBoard logging (view with:  %load_ext tensorboard ; %tensorboard --logdir logs)\nrun_logdir = os.path.join(\"logs\", time.strftime(\"run_%Y_%m_%d-%H_%M_%S\"))\nhistory = model.fit(train_ds, epochs=5, validation_data=validation_ds,\n                    callbacks=[keras.callbacks.TensorBoard(run_logdir)])\n\n# 4. Evaluate and visualise\ntest_loss, test_acc = model.evaluate(test_ds, verbose=0)\nprint(f\"Test loss: {test_loss:.4f} | Test accuracy: {test_acc:.4f}\")\n\nfig, ax = plt.subplots(1, 2, figsize=(11, 4))\nax[0].plot(history.history[\"accuracy\"], label=\"train\"); ax[0].plot(history.history[\"val_accuracy\"], label=\"val\")\nax[0].set_title(\"Accuracy\"); ax[0].set_xlabel(\"epochs\"); ax[0].legend()\nax[1].plot(history.history[\"loss\"], label=\"train\"); ax[1].plot(history.history[\"val_loss\"], label=\"val\")\nax[1].set_title(\"Loss\"); ax[1].set_xlabel(\"epochs\"); ax[1].legend()\nplt.show()\n\nxb, yb = next(iter(test_ds))\npb = np.argmax(model.predict(xb, verbose=0), axis=1)\nplt.figure(figsize=(12, 3))\nfor i in range(8):\n    img = xb[i].numpy(); img = (img - img.min()) / (img.max() - img.min())\n    plt.subplot(1, 8, i + 1); plt.imshow(img); plt.axis(\"off\")\n    plt.title(f\"{CLASS_NAMES[pb[i]]}\\n({CLASS_NAMES[int(yb[i])]})\", fontsize=7)\nplt.suptitle(\"Predicted (true)\"); plt.show()",
    "lineCount": 81
  },
  {
    "id": "ex-13a",
    "codeLabel": "Ex 13a",
    "title": "RNN",
    "aim": "Classify MNIST digits sequentially by reading each 28x28 image row by row.",
    "category": "Sequences & Forecasting",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "MNIST (28 steps x 28)",
    "datasetSetup": "Built in",
    "datasetNotes": "Treats each 28x28 digit as 28 sequential row vectors of 28 pixel intensities.",
    "modelType": "Stacked SimpleRNN",
    "optimizer": "Adam (lr=1e-3, clipnorm=1)",
    "loss": "sparse_categorical_crossentropy",
    "epochs": "5",
    "batchSize": "128",
    "seed": "42",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(28, 28)",
        "kind": "input"
      },
      {
        "name": "SimpleRNN(128)",
        "detail": "return_sequences=True + Drop(0.2)",
        "kind": "recurrent"
      },
      {
        "name": "SimpleRNN(128)",
        "detail": "final state + Dropout(0.1)",
        "kind": "recurrent"
      },
      {
        "name": "Dense(32) -> Dense(10)",
        "detail": "relu + Drop(0.2) -> softmax",
        "kind": "output"
      }
    ],
    "highlights": [
      "Stacks two SimpleRNN layers over image rows without convolutional spatial kernels.",
      "Enables clipnorm=1.0 on Adam to tame exploding recurrent gradients.",
      "Plots accuracy, loss, and 10 digit predictions alongside ground truth."
    ],
    "code": "# Ex-13(a)  Recurrent neural network: classify MNIST digits by reading each image row by row\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\n\nkeras.utils.set_random_seed(42)\n\n# 1. Data: each 28x28 image is a sequence of 28 time steps with 28 features\n(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()\nx_train = x_train.astype(\"float32\") / 255.0\nx_test = x_test.astype(\"float32\") / 255.0\nprint(x_train.shape, x_train[0].shape)\n\n# 2. Stacked SimpleRNN (tanh) -> dense classifier\nmodel = keras.Sequential([\n    keras.Input(shape=x_train.shape[1:]),\n    layers.SimpleRNN(128, return_sequences=True),\n    layers.Dropout(0.2),\n    layers.SimpleRNN(128),\n    layers.Dropout(0.1),\n    layers.Dense(32, activation=\"relu\"),\n    layers.Dropout(0.2),\n    layers.Dense(10, activation=\"softmax\"),\n])\nmodel.compile(loss=\"sparse_categorical_crossentropy\",\n              optimizer=keras.optimizers.Adam(learning_rate=1e-3, clipnorm=1.0),   # clipnorm tames exploding gradients\n              metrics=[\"accuracy\"])\nmodel.summary()\n\n# 3. Train and evaluate\nhistory = model.fit(x_train, y_train, epochs=5, batch_size=128, validation_data=(x_test, y_test))\nloss, acc = model.evaluate(x_test, y_test, verbose=0)\nprint(f\"Test loss: {loss:.4f} | Test accuracy: {acc:.4f}\")\n\n# 4. Curves and predictions\nfig, ax = plt.subplots(1, 2, figsize=(11, 4))\nax[0].plot(history.history[\"accuracy\"], label=\"train\"); ax[0].plot(history.history[\"val_accuracy\"], label=\"val\")\nax[0].set_title(\"Accuracy\"); ax[0].set_xlabel(\"epochs\"); ax[0].legend()\nax[1].plot(history.history[\"loss\"], label=\"train\"); ax[1].plot(history.history[\"val_loss\"], label=\"val\")\nax[1].set_title(\"Loss\"); ax[1].set_xlabel(\"epochs\"); ax[1].legend()\nplt.show()\n\npred = np.argmax(model.predict(x_test[:10], verbose=0), axis=1)\nplt.figure(figsize=(12, 2))\nfor i in range(10):\n    plt.subplot(1, 10, i + 1); plt.imshow(x_test[i], cmap=\"gray\"); plt.axis(\"off\")\n    plt.title(f\"{pred[i]} ({y_test[i]})\", fontsize=8)\nplt.suptitle(\"Predicted (true)\"); plt.show()",
    "lineCount": 49
  },
  {
    "id": "ex-13b",
    "codeLabel": "Ex 13b",
    "title": "LSTM",
    "aim": "Forecast monthly international AirPassengers counts using an LSTM model.",
    "category": "Sequences & Forecasting",
    "runtime": "CPU",
    "gpuRequired": false,
    "datasetName": "AirPassengers CSV",
    "datasetSetup": "Auto download",
    "datasetNotes": "Loads airline-passengers.csv from GitHub, normalized to [0, 1] via MinMaxScaler.",
    "modelType": "Single layer LSTM",
    "optimizer": "Adam",
    "loss": "mean_squared_error",
    "epochs": "100",
    "batchSize": "1",
    "seed": "7",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(1, look_back=1)",
        "kind": "input"
      },
      {
        "name": "LSTM(4)",
        "detail": "4 memory units",
        "kind": "recurrent"
      },
      {
        "name": "Dense(1)",
        "detail": "linear regression output",
        "kind": "output"
      }
    ],
    "highlights": [
      "Splits 67% train and 33% test strictly in chronological order without shuffling.",
      "Reshapes windows to [samples, time steps, features] for stateful sequence ingestion.",
      "Inverts MinMaxScaler before computing Train and Test RMSE in passenger units."
    ],
    "code": "# Ex-13(b)  LSTM time-series forecasting: AirPassengers\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn.preprocessing import MinMaxScaler\nfrom sklearn.metrics import mean_squared_error\n\nkeras.utils.set_random_seed(7)\n\n# 1. Load the monthly passenger counts\nURL = \"https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv\"\ndataframe = pd.read_csv(URL, usecols=[1], engine=\"python\")        # AirPassengers.csv works too\ndataset = dataframe.values.astype(\"float32\")\nplt.plot(dataset); plt.title(\"International airline passengers\"); plt.xlabel(\"month\"); plt.show()\n\n# 2. Normalise to [0, 1] and split 67% / 33% in time order\nscaler = MinMaxScaler(feature_range=(0, 1))\ndataset = scaler.fit_transform(dataset)\ntrain_size = int(len(dataset) * 0.67)\ntrain, test = dataset[:train_size], dataset[train_size:]\nprint(\"train / test points:\", len(train), len(test))\n\n# 3. Turn the series into (X = previous `look_back` values, y = next value)\ndef create_dataset(data, look_back=1):\n    X, Y = [], []\n    for i in range(len(data) - look_back - 1):\n        X.append(data[i:i + look_back, 0]); Y.append(data[i + look_back, 0])\n    return np.array(X), np.array(Y)\n\nlook_back = 1\ntrainX, trainY = create_dataset(train, look_back)\ntestX, testY = create_dataset(test, look_back)\ntrainX = trainX.reshape(trainX.shape[0], 1, trainX.shape[1])      # [samples, time steps, features]\ntestX = testX.reshape(testX.shape[0], 1, testX.shape[1])\n\n# 4. LSTM(4) -> Dense(1)\nmodel = keras.Sequential([\n    keras.Input(shape=(1, look_back)),\n    layers.LSTM(4),\n    layers.Dense(1),\n])\nmodel.compile(loss=\"mean_squared_error\", optimizer=\"adam\")\nmodel.summary()\nhistory = model.fit(trainX, trainY, epochs=100, batch_size=1, verbose=0)\nprint(\"final training loss:\", round(history.history[\"loss\"][-1], 6))\n\n# 5. Predict, undo the scaling, report RMSE\ntrainPredict = scaler.inverse_transform(model.predict(trainX, verbose=0))\ntestPredict = scaler.inverse_transform(model.predict(testX, verbose=0))\ntrainY_inv = scaler.inverse_transform([trainY]); testY_inv = scaler.inverse_transform([testY])\nprint(\"Train Score: %.2f RMSE\" % np.sqrt(mean_squared_error(trainY_inv[0], trainPredict[:, 0])))\nprint(\"Test Score: %.2f RMSE\" % np.sqrt(mean_squared_error(testY_inv[0], testPredict[:, 0])))\n\n# 6. Plot actual vs predicted over the whole series\ntrainPlot = np.full_like(dataset, np.nan); trainPlot[look_back:len(trainPredict) + look_back] = trainPredict\ntestPlot = np.full_like(dataset, np.nan)\ntestPlot[len(trainPredict) + (look_back * 2) + 1:len(dataset) - 1] = testPredict\nplt.figure(figsize=(10, 4))\nplt.plot(scaler.inverse_transform(dataset), label=\"actual\")\nplt.plot(trainPlot, label=\"train prediction\"); plt.plot(testPlot, label=\"test prediction\")\nplt.title(\"LSTM forecast: AirPassengers\"); plt.xlabel(\"month\"); plt.legend(); plt.show()",
    "lineCount": 63
  },
  {
    "id": "ex-14",
    "codeLabel": "Ex 14",
    "title": "GRU",
    "aim": "Compare 4 layer stacked GRU and LSTM models on IBM daily High stock prices.",
    "category": "Sequences & Forecasting",
    "runtime": "GPU Recommended",
    "gpuRequired": true,
    "datasetName": "IBM Daily Stock (2006 to 2018)",
    "datasetSetup": "Auto download or CSV upload",
    "datasetNotes": "Fetches via yfinance and caches IBM.csv; prompts Colab upload if blocked.",
    "modelType": "4 layer Stacked GRU vs LSTM",
    "optimizer": "RMSprop",
    "loss": "mean_squared_error",
    "epochs": "20",
    "batchSize": "32",
    "seed": "42",
    "layers": [
      {
        "name": "Input",
        "detail": "shape=(60, 1)",
        "kind": "input"
      },
      {
        "name": "3x [GRU|LSTM(50)]",
        "detail": "return_sequences=True + Drop(0.2)",
        "kind": "recurrent"
      },
      {
        "name": "GRU|LSTM(50)",
        "detail": "return_sequences=False + Drop(0.2)",
        "kind": "recurrent"
      },
      {
        "name": "Dense(1)",
        "detail": "next day High forecast",
        "kind": "output"
      }
    ],
    "highlights": [
      "Constructs 60 trading day sliding windows trained up to 2016 and tested on 2017.",
      "Holds architecture and RMSprop optimizer identical between LSTM and GRU runs.",
      "Prints both RMSE scores and overlays real, LSTM, and GRU trajectories."
    ],
    "code": "# Ex-14  GRU (compared with LSTM) for stock-price forecasting: IBM \"High\" price\nimport os, math\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport keras\nfrom keras import layers\nfrom sklearn.preprocessing import MinMaxScaler\nfrom sklearn.metrics import mean_squared_error\n\nkeras.utils.set_random_seed(42)\n\n# 1. Data: IBM daily prices 2006-2018 (cached to IBM.csv). Train: up to 2016, test: 2017.\ndef load_ibm():\n    if os.path.exists(\"IBM.csv\"):\n        return pd.read_csv(\"IBM.csv\", index_col=\"Date\", parse_dates=[\"Date\"])\n    try:\n        import yfinance as yf                                      # Colab:  !pip -q install yfinance\n        df = yf.download(\"IBM\", start=\"2006-01-01\", end=\"2018-01-01\", auto_adjust=False, progress=False)\n        df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]\n        df = df[[\"Open\", \"High\", \"Low\", \"Close\", \"Volume\"]]\n        df.to_csv(\"IBM.csv\")\n        return df\n    except Exception as e:\n        print(\"download failed:\", type(e).__name__, \"- upload IBM.csv (Date, Open, High, Low, Close, Volume)\")\n        from google.colab import files\n        files.upload()\n        return pd.read_csv(\"IBM.csv\", index_col=\"Date\", parse_dates=[\"Date\"])\n\ndataset = load_ibm()\ntraining_set = dataset[:\"2016\"][\"High\"].values.reshape(-1, 1)\ntest_set = dataset[\"2017\":][\"High\"].values.reshape(-1, 1)\n\ndataset[\"High\"][:\"2016\"].plot(figsize=(14, 4), legend=True)\ndataset[\"High\"][\"2017\":].plot(legend=True)\nplt.legend([\"Training set (up to 2016)\", \"Test set (2017)\"]); plt.title(\"IBM stock price (High)\"); plt.show()\n\n# 2. Scale and build windows: 60 previous days -> next day\nsc = MinMaxScaler(feature_range=(0, 1))\ntraining_scaled = sc.fit_transform(training_set)\nWINDOW = 60\nX_train = np.array([training_scaled[i - WINDOW:i, 0] for i in range(WINDOW, len(training_scaled))])\ny_train = np.array([training_scaled[i, 0] for i in range(WINDOW, len(training_scaled))])\nX_train = X_train.reshape(X_train.shape[0], WINDOW, 1)\n\ntotal = pd.concat((dataset[\"High\"][:\"2016\"], dataset[\"High\"][\"2017\":]), axis=0)\ninputs = sc.transform(total[len(total) - len(test_set) - WINDOW:].values.reshape(-1, 1))\nX_test = np.array([inputs[i - WINDOW:i, 0] for i in range(WINDOW, WINDOW + len(test_set))])\nX_test = X_test.reshape(X_test.shape[0], WINDOW, 1)\n\ndef stacked(cell):\n    m = keras.Sequential([keras.Input(shape=(WINDOW, 1))])\n    for i in range(4):\n        m.add(cell(50, return_sequences=(i < 3)))\n        m.add(layers.Dropout(0.2))\n    m.add(layers.Dense(1))\n    return m\n\ndef rmse(real, pred):\n    return math.sqrt(mean_squared_error(real, pred))\n\n# 3. Same stacked architecture and same optimizer (RMSprop) for LSTM and GRU, so the comparison is fair\n#    (the manual trained the GRU with SGD + momentum, which needs many more epochs to converge)\nEPOCHS = 20   # the manual uses 5; more epochs lets both models converge\nlstm_model = stacked(layers.LSTM)\nlstm_model.compile(optimizer=\"rmsprop\", loss=\"mean_squared_error\")\nlstm_model.fit(X_train, y_train, epochs=EPOCHS, batch_size=32, verbose=2)\nlstm_pred = sc.inverse_transform(lstm_model.predict(X_test, verbose=0))\n\ngru_model = stacked(layers.GRU)\ngru_model.compile(optimizer=\"rmsprop\", loss=\"mean_squared_error\")\ngru_model.summary()\ngru_model.fit(X_train, y_train, epochs=EPOCHS, batch_size=32, verbose=2)\ngru_pred = sc.inverse_transform(gru_model.predict(X_test, verbose=0))\n\n# 4. Compare\nprint(\"LSTM RMSE:\", round(rmse(test_set, lstm_pred), 4))\nprint(\"GRU  RMSE:\", round(rmse(test_set, gru_pred), 4))\n\nplt.figure(figsize=(12, 4))\nplt.plot(test_set, color=\"red\", label=\"Real IBM stock price\")\nplt.plot(lstm_pred, color=\"blue\", label=\"LSTM prediction\")\nplt.plot(gru_pred, color=\"green\", label=\"GRU prediction\")\nplt.title(\"IBM stock price prediction\"); plt.xlabel(\"Time\"); plt.ylabel(\"IBM stock price\"); plt.legend(); plt.show()",
    "lineCount": 84
  }
];

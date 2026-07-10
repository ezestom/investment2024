import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast, Toaster } from "sonner";
import x from "../../icons/x.svg";
import "./Form.css";
import logo from "../../icons/finance.svg";
import finance from "../../img/form.png";

export function Form() {
	const [dialog, setDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isMessageSuccess()) {
			toast("Información enviada con éxito! Gracias por tu confianza.", {
				type: "success",
			});
			closeDialog();
		}
	}, []); // Agrega las dependencias aquí

	const openDialog = () => {
		setDialog(true);
		document.body.style.overflow = "hidden";
	};

	const closeDialog = () => {
		setDialog(false);
		document.body.style.overflow = "auto";
	};

	const isMessageSuccess = () => {
		return (
			new URLSearchParams(window.location.search).get("success") ===
			"true"
		);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);

		setIsLoading(true);

		// Convert FormData to a JSON object for FormSubmit's AJAX endpoint
		const data = {};
		formData.forEach((value, key) => {
			data[key] = value;
		});

		// Use FormSubmit's AJAX endpoint: https://formsubmit.co/ajax/your-email
		const ajaxAction = form.action.includes("/ajax/")
			? form.action
			: form.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

		try {
			const response = await fetch(ajaxAction, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Server responded with ${response.status}: ${errorText}`
				);
			}

			toast("Información enviada con éxito! Gracias por tu confianza.", {
				type: "success",
			});

			setTimeout(() => {
				const isEnglish = window.location.pathname.startsWith("/en");
				const redirectTo = isEnglish
					? "/en/message-sent"
					: "/message-sent";

				closeDialog();
				window.location.href = redirectTo;
				setIsLoading(false);
			}, 3000);
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error(
				`Hubo un error al enviar la información. Por favor, inténtalo de nuevo. 
         (Error: ${error.message})`
			);
			setIsLoading(false); // Asegúrate de desactivar el loading en caso de error
		}
	};

	return (
		<div className="form-container z-10 w-full flex">
			<Toaster />
			<div className="flex w-full items-start justify-start">
				<button
					onClick={openDialog}
					className="transition-colors group flex w-full items-center gap-3 hover:bg-[--darkblue] dark:hover:bg-[--darkblue]/80 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white py-2.5 px-3.5 rounded-xl font-semibold text-sm">
					<span className="relative w-5 h-5 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
							className="w-5 h-5 transition duration-300 group-hover:scale-110 opacity-100 group-hover:opacity-0 absolute fill-none stroke-current"
							strokeWidth="4"
							strokeLinejoin="round"
						>
							<path d="M5.325 43.5h8.485l31.113-31.113l-8.486-8.485L5.325 35.015z"/>
							<path strokeLinecap="round" d="m27.952 12.387l8.485 8.485"/>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
							className="w-5 h-5 transition duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-110 absolute fill-current stroke-current"
							strokeWidth="4"
							strokeLinejoin="round"
						>
							<path d="M5.325 43.5h8.485l31.113-31.113l-8.486-8.485L5.325 35.015z" />
							<path strokeLinecap="round" d="m27.952 12.387l8.485 8.485" />
						</svg>
					</span>
					<span className="whitespace-nowrap transition-colors">
						Enviar mensaje
					</span>
				</button>
			</div>

			{dialog && typeof window !== "undefined" && createPortal(
				<dialog open className="fixed inset-0 z-[10000] w-full h-full border-0 bg-transparent p-0 outline-none overflow-y-auto m-0 max-w-none max-h-none">
					<section className="w-full min-h-screen bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
						<div className="lg:grid h-full min-h-full lg:grid-cols-12 w-full px-4 md:px-0">
							<aside className="relative hidden md:block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
								<picture>
									<img
										src={finance.src}
										alt="finance image"
										className="absolute inset-0 h-full w-full object-cover hidden lg:block"
									/>
									<img
										src={logo.src}
										className="absolute  bottom-20 mx-auto left-10 max-w-[150px] drop-shadow-md"
										alt="logo"
									/>
								</picture>
							</aside>

							<main className="flex items-center justify-center py-8 md:px-12 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6  ">
								<div className="form-container-dialog  p-8 bg-[#f0f0f0] rounded-3xl relative">
									<button
										className="absolute z-100 top-2 right-2 "
										onClick={closeDialog}>
										<img
											className="inline-flex  cursor-pointer items-center justify-center rounded-3xl bg-gradient-to-r from-[#030f33] to-[#4e737a]  p-2 hover:scale-105 transition font-medium text-gray-50 backdrop-blur-3xl"
											src={x.src}
											alt="x-icon"
											id="close-dialog"
										/>
									</button>
									<h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
										Gracias por tu interés en Aprender a
										Invertir 📈
									</h1>

									<p className="mt-4 leading-relaxed text-gray-700">
										Para brindarte la mejor atención, por
										favor completa el siguiente formulario.
									</p>
									{isLoading && (
										<div className="absolute top-0 left-0 right-0 bottom-0 backdrop-blur bg-white/10 opacity-50 flex justify-center items-center z-50 rounded-3xl">
											<span className="loader"></span>
										</div>
									)}
									<form
										onSubmit={handleSubmit}
										method="POST"
										action="https://formsubmit.co/ezequielstom@gmail.com"
										className="mt-8 grid grid-cols-6 gap-6">
										<input
											type="hidden"
											name="_subject"
											value="📈 Aprender a Invertir | 📩 Nuevo Mensaje!"
										/>
										<input
											type="hidden"
											name="_autoresponse"
											value="Gracias por tu mensaje, en breve nos pondremos en contacto."
										/>

										<input
											type="hidden"
											name="_captcha"
											value="false"
										/>

										<div className="col-span-6 sm:col-span-3">
											<label className="block text-sm font-medium text-gray-700">
												Nombre
												<input
													type="text"
													name="name"
													id="name"
													placeholder="John Doe"
													required
													className="p-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
												/>
											</label>
										</div>
										<div className="col-span-6 sm:col-span-3">
											<label className="block text-sm font-medium text-gray-700">
												Compañía
												<input
													type="text"
													name="company"
													id="company"
													placeholder="Cacta SaS."
													required
													className="p-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
												/>
											</label>
										</div>
										<div className="col-span-6">
											<label className="block text-sm font-medium text-gray-700">
												Email
												<input
													className="p-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
													type="email"
													name="email"
													id="email"
													required
													placeholder="john_doe@ejemplo.com"
												/>
											</label>
										</div>
										<fieldset className="col-span-6">
											<legend className="block text-sm font-medium text-gray-700">
												Mensaje
												<textarea
													name="message"
													id="message"
													required
													className="w-full border-gray-200 rounded-md bg-white text-sm text-gray-700 shadow-sm p-2 max-h-[100px]"
													placeholder="Quisiera recibir información"></textarea>
											</legend>
										</fieldset>

										<div className="col-span-6 sm:flex sm:items-center sm:gap-4">
											<button
												className="flex w-full sm:w-auto justify-center items-center gap-3 rounded-md bg-[--lightblue] px-3 py-2 text-[--darkblue] transition-colors duration-300 ease-in-out hover:bg-[--darkblue] hover:text-[--lightblue]"
												type="submit">
												Enviar
											</button>
											<p className="mt-4 text-sm text-gray-700 font-semibold sm:mt-0 ">
												✉️ A la brevedad nos pondremos
												en contacto.
											</p>
										</div>
									</form>
								</div>
							</main>
						</div>
					</section>
				</dialog>,
				document.body
			)}
		</div>
	);
}


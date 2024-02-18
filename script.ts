interface Veiculo {
	nome: string;
	placa: string;
	entrada: Date | string;
}

(() => {
	const $ = (query: string): HTMLInputElement | null =>
		document.querySelector(query);

	function calcTempo(mil: number): string {
		const min = Math.floor(mil / 60000);
		const sec = Math.floor((mil % 60000) / 1000);

		return `${min}m e ${sec}s`;
	}

	function patio() {
		function ler(): Veiculo[] {
			return localStorage.patio ? JSON.parse(localStorage.patio) : [];
		}

		function salvar(veiculos: Veiculo[]) {
			localStorage.setItem("patio", JSON.stringify(veiculos));
		}

		function adicionar(veiculo: Veiculo, salva?: boolean) {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;

			row.querySelector(".delete")?.addEventListener("click", (event) => {
				const placa = (event.target as HTMLElement).dataset.placa;
				if (placa) {
					remover(placa);
				}
			});

			$("#patio")?.appendChild(row);

			if (salva) salvar([...ler(), veiculo]);
		}

		function remover(placa: string) {
			const { entrada, nome } = ler().find(
				(veiculo) => veiculo.placa === placa,
			);

			const tempo = calcTempo(
				new Date().getTime() - new Date(entrada).getTime(),
			);

			if (
				!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)
			)
				return;

			salvar(ler().filter((veiculo) => veiculo.placa !== placa));
			render();
		}

		function render() {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			$("#patio")!.innerHTML = "";
			const patio = ler();

			if (patio.length) {
				for (const veiculo of patio) {
					adicionar(veiculo, false);
				}
			}
		}

		return { ler, adicionar, remover, salvar, render };
	}

	patio().render();

	$("#cadastrar")?.addEventListener("click", () => {
		const nome = $("#nome")?.value;
		const placa = $("#placa")?.value;

		if (!nome || !placa) {
			alert("Preencha todos os campos!");
			return;
		}

		patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
	});
})();

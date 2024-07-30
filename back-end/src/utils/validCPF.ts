export default function ValidCPF(cpf: string) {

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    let formatedCpf = cpf.trim();
    
    if (!cpfRegex.test(formatedCpf)) {
        throw new Error('Invalid CPF format');
    }

    return formatedCpf
}
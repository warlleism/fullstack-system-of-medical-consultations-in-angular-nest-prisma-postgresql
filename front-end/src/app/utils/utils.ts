export function formatPhone(event: any) {
    const input = event.target.value.replace(/\D/g, '');
    const formattedInput = input.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return formattedInput;

}

export function formatCPF(event: any) {
    const input = event.target.value.replace(/\D/g, '');
    const formattedInput = input.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formattedInput;
}

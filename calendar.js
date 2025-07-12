// Sistema de Agendamento para Janaina Iara
// Baseado em arquivo JSON de disponibilidade

class CalendarScheduler {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.availability = [
            {
                "date": "2025-07-08",
                "availableTimes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
            },
            {
                "date": "2025-07-09",
                "availableTimes": ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"]
            },
            {
                "date": "2025-07-10",
                "availableTimes": ["DIA_FREELANCER"]
            },
            {
                "date": "2025-07-11",
                "availableTimes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
            },
            {
                "date": "2025-07-12",
                "availableTimes": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
            },
            {
                "date": "2025-07-15",
                "availableTimes": ["DIA_FREELANCER"]
            },
            {
                "date": "2025-07-16",
                "availableTimes": ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
            }
        ];
        
        this.init();
    }

    async init() {
        this.render();
        this.bindEvents();
    }

    isDateAvailable(dateString) {
        return this.availability.some(item => item.date === dateString);
    }

    getAvailableTimesForDate(dateString) {
        const dateItem = this.availability.find(item => item.date === dateString);
        return dateItem ? dateItem.availableTimes : [];
    }

    render() {
        const schedulingSection = document.getElementById('agendamento');
        if (!schedulingSection) return;
        schedulingSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Agendar Tosa</h2>
                    <p class="section-subtitle">Escolha o melhor dia e horário para seu pet</p>
                </div>
                <div class="scheduler-container">
                    <div class="calendar-section">
                        <div class="calendar-header">
                            <button class="nav-btn" id="prevMonth">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <h3 id="calendarTitle"></h3>
                            <button class="nav-btn" id="nextMonth">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        <div class="calendar-grid">
                            <div class="weekdays">
                                <div class="weekday">Dom</div>
                                <div class="weekday">Seg</div>
                                <div class="weekday">Ter</div>
                                <div class="weekday">Qua</div>
                                <div class="weekday">Qui</div>
                                <div class="weekday">Sex</div>
                                <div class="weekday">Sáb</div>
                            </div>
                            <div class="days-grid" id="calendarDays"></div>
                        </div>
                    </div>
                    <div class="time-section">
                        <h4>Horários Disponíveis</h4>
                        <div class="time-slots" id="timeSelection">
                            <p class="select-date-message">Selecione uma data para ver os horários disponíveis</p>
                        </div>
                    </div>
                </div>
                    
                <div class="appointment-form" id="bookingForm" style="display: none;">
                    <h4>Confirmar Agendamento</h4>
                    <div class="selected-info">
                        <p><strong>Data:</strong> <span id="selectedDateDisplay"></span></p>
                        <p><strong>Horário:</strong> <span id="selectedTimeDisplay"></span></p>
                    </div>
                        <form id="scheduleForm">
                            <div class="form-group">
                                <input type="text" id="clientName" placeholder="Seu nome" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" id="clientPhone" placeholder="Seu telefone" required>
                            </div>
                            <div class="form-group">
                                <input type="text" id="petName" placeholder="Nome do pet" required>
                            </div>
                            <div class="form-group">
                                <select id="serviceType" required>
                                    <option value="">Selecione o serviço</option>
                                    <option value="dia-freelancer">Dia de Freelancer (Dia Completo)</option>
                                    <option value="banho">Banho</option>
                                    <option value="tosa-higienica">Tosa Higiênica</option>
                                    <option value="tosa-tesoura">Tosa na Tesoura</option>
                                    <option value="tosa-maquina">Tosa na Máquina</option>
                                    <option value="tosa-raca">Tosa da Raça</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <textarea id="observations" placeholder="Observações (opcional)" rows="3"></textarea>
                            </div>
                        <div class="form-buttons">
                            <button type="button" class="btn btn-secondary" id="cancelSchedule">Cancelar</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fab fa-whatsapp"></i>
                                Confirmar via WhatsApp
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        `;

        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Atualizar título
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        document.getElementById('calendarTitle').textContent = `${monthNames[month]} ${year}`;
        
        // Calcular dias do mês
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        
        // Dias vazios do início
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarDays.appendChild(emptyDay);
        }
        
        // Dias do mês
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            const currentDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayDate = new Date(year, month, day);
            
            // Verificar se é uma data passada
            if (dayDate < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add("past");
            }
            // Verificar se é domingo
            else if (dayDate.getDay() === 0) {
                dayElement.classList.add("unavailable");
            }
            // Se não for passado ou domingo, o dia é clicável. A disponibilidade de horários será verificada ao clicar.
            else {
                dayElement.classList.add("clickable-day"); // Nova classe para dias clicáveis
                dayElement.addEventListener("click", () => this.selectDate(currentDateString, dayElement));
            }
            
            calendarDays.appendChild(dayElement);
        }
    }

    selectDate(dateString, dayElement) {
        // Remover seleção anterior
        document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
        
        // Selecionar nova data
        dayElement.classList.add('selected');
        this.selectedDate = dateString;
        this.selectedTime = null;
        
        // Atualizar display da data selecionada
        const formattedDate = new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const selectedDateDisplay = document.getElementById('selectedDateDisplay');
        if (selectedDateDisplay) {
            selectedDateDisplay.textContent = formattedDate;
        }
        
        // Mostrar horários disponíveis
        this.showAvailableTimes(dateString);
        
        // Esconder formulário se estava visível
        document.getElementById('bookingForm').style.display = 'none';
    }

    showAvailableTimes(dateString) {
        const timeSelection = document.getElementById('timeSelection');
        const availableTimes = this.getAvailableTimesForDate(dateString);
        
        // Se não há horários configurados para esta data, exibir mensagem
        if (availableTimes.length === 0) {
            timeSelection.innerHTML = `
                <p class="select-date-message">Nenhum horário disponível para esta data.</p>
            `;
            return;
        }
        
        const formattedDate = new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Verificar se é um dia de freelancer
        if (availableTimes.includes('DIA_FREELANCER')) {
            timeSelection.innerHTML = `           
	       <!-- <p class="select-date-message">Dia completo disponível para freelancer</p> -->
                <div class="time-slots">
                    <button class="time-slot freelancer-day" data-time="DIA_FREELANCER">
                        <i class="fas fa-calendar-day"></i>
                        Dia Completo de Freelancer
                    </button>
                </div>
            `;
        } else {
            timeSelection.innerHTML = `
                <div class="time-slots">
                    ${availableTimes.map(time => `
                        <button class="time-slot" data-time="${time}">${time}</button>
                    `).join('')}
                </div>
            `;
        }
        
        // Adicionar eventos aos botões de horário
        document.querySelectorAll('.time-slot').forEach(button => {
            button.addEventListener('click', () => this.selectTime(button.dataset.time, button));
        });
    }

    selectTime(time, buttonElement) {
        // Remover seleção anterior
        document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
        
        // Selecionar novo horário
        buttonElement.classList.add('selected');
        this.selectedTime = time;
        
        // Atualizar display do horário selecionado
        const selectedTimeDisplay = document.getElementById('selectedTimeDisplay');
        if (selectedTimeDisplay) {
            if (time === 'DIA_FREELANCER') {
                selectedTimeDisplay.textContent = 'Dia Completo de Freelancer';
            } else {
                selectedTimeDisplay.textContent = time;
            }
        }
        
        // Mostrar formulário
        document.getElementById('bookingForm').style.display = 'block';
        
        // Se for dia de freelancer, pré-selecionar a opção
        if (time === 'DIA_FREELANCER') {
            document.getElementById('serviceType').value = 'dia-freelancer';
            document.getElementById('petName').placeholder = "Nome da empresa/cliente (opcional)";
            document.getElementById('petName').required = false;
        } else {
            // Resetar para serviços por hora
            document.getElementById('serviceType').value = '';
            document.getElementById('petName').placeholder = "Nome do pet";
            document.getElementById('petName').required = true;
        }
        
        // Ajustar o campo de nome do pet baseado no tipo de serviço
        this.updateFormForServiceType();
        
        document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
    }

    updateFormForServiceType() {
        const serviceSelect = document.getElementById('serviceType');
        const petNameField = document.getElementById('petName');
        
        // Adicionar evento para detectar mudança no tipo de serviço
        serviceSelect.addEventListener('change', () => {
            if (serviceSelect.value === 'dia-freelancer') {
                petNameField.placeholder = "Nome da empresa/cliente (opcional)";
                petNameField.required = false;
            } else {
                petNameField.placeholder = "Nome do pet";
                petNameField.required = true;
            }
        });
    }

    bindEvents() {
        // Navegação do calendário
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        // Formulário de agendamento
        document.getElementById('scheduleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBooking();
        });
        
        // Botão cancelar
        const cancelButton = document.getElementById('cancelSchedule');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                document.getElementById('bookingForm').style.display = 'none';
                document.getElementById('scheduleForm').reset();
                // Remover seleção de horário
                document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
                this.selectedTime = null;
            });
        }
    }

    submitBooking() {
        const formData = {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            petName: document.getElementById('petName').value,
            service: document.getElementById('serviceType').value,
            observations: document.getElementById('observations').value,
            date: this.selectedDate,
            time: this.selectedTime
        };
        
        // Formatar data para exibição
        const formattedDate = new Date(this.selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Criar mensagem para WhatsApp baseada no tipo de serviço
        let message;
        
        if (formData.service === 'dia-freelancer') {
            message = `🐾 *CONTRATAÇÃO - DIA DE FREELANCER* 🐾

Olá Janaina! Gostaria de contratar seus serviços para um dia completo de freelancer.

*Data:* ${formattedDate}
*Serviço:* ${this.getServiceName(formData.service)}
*Nome:* ${formData.name}
*Telefone:* ${formData.phone}
${formData.petName ? `*Empresa/Cliente:* ${formData.petName}` : ''}
${formData.observations ? `*Observações:* ${formData.observations}` : ''}

Aguardo sua confirmação para o dia completo de trabalho de freelancer!`;
        } else {
            message = `🐾 *AGENDAMENTO DE TOSA* 🐾

Olá Janaina! Gostaria de agendar um horário.

*Data:* ${formattedDate}
*Horário:* ${this.selectedTime}
*Nome:* ${formData.name}
*Telefone:* ${formData.phone}
*Nome do Pet:* ${formData.petName}
*Serviço:* ${this.getServiceName(formData.service)}
${formData.observations ? `*Observações:* ${formData.observations}` : ''}

Aguardo sua confirmação!`;
        }
        
        // Abrir WhatsApp
        const whatsappUrl = `https://wa.me/5517988146826?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Mostrar mensagem de sucesso
        if (formData.service === 'dia-freelancer') {
            alert('Redirecionando para o WhatsApp para confirmar a contratação do dia completo de freelancer!');
        } else {
            alert('Redirecionando para o WhatsApp para confirmar o agendamento!');
        }
    }

    getServiceName(serviceValue) {
        const services = {
            'dia-freelancer': 'Dia de Freelancer (Dia Completo)',
            'banho': 'Banho',
            'tosa-higienica': 'Tosa Higiênica',
            'tosa-tesoura': 'Tosa na Tesoura',
            'tosa-maquina': 'Tosa na Máquina',
            'tosa-raca': 'Tosa da Raça'
        };
        return services[serviceValue] || serviceValue;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CalendarScheduler();
});


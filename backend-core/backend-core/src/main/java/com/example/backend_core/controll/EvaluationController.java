package com.example.backend_core.controll;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
//import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend_core.model.Evaluation;
import com.example.backend_core.model.Sentence;
import com.example.backend_core.model.User;
import com.example.backend_core.repository.EvaluationRepository;
import com.example.backend_core.repository.SentenceRepository;
import com.example.backend_core.repository.UserRepository;
import com.example.backend_core.service.AIService;
import com.google.gson.Gson;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/evaluate")
@RequiredArgsConstructor
public class EvaluationController {

        private final AIService aiService;
        private final SentenceRepository sentenceRepository;
        private final UserRepository userRepository;
        private final EvaluationRepository evaluationRepository;

        @PostMapping
        public ResponseEntity<?> evaluate(	
                        @RequestParam("audio") MultipartFile audio,
                        @RequestParam("sentenceId") Long sentenceId,
                        Authentication authentication
        ) {	
                if (authentication == null || authentication.getName() == null) {
                        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized. Please log in again."));
                }

                // Lấy user từ JWT token
                String username = authentication.getName();
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found: " + username));

                // Lấy sentence từ DB
                Sentence sentence = sentenceRepository.findById(sentenceId)
                                .orElseThrow(() -> new RuntimeException("Sentence not found: " + sentenceId));

                // Gọi Python AI
                Map<String, Object> aiResult = aiService.evaluateAudio(
                                audio, sentence.getContent());

                if (aiResult == null) {
                        return ResponseEntity.status(502).body(Map.of("error", "AI service returned null result"));
                }

                // Lưu Evaluation vào DB
                Evaluation evaluation = new Evaluation();
                evaluation.setSentence(sentence);
                evaluation.setUser(user);
                evaluation.setTranscript(aiResult.get("transcript") != null ? aiResult.get("transcript").toString() : "");
                evaluation.setExpectedTextSnapshot(sentence.getContent());
                evaluation.setScore(aiResult.get("score") != null ? Double.valueOf(aiResult.get("score").toString()) : 0.0);
                Gson gson = new Gson();
                evaluation.setMistakes(gson.toJson(aiResult.get("mistakes")));
                
                evaluationRepository.save(evaluation);

                return ResponseEntity.ok(aiResult);
        }
        
        // GET /api/evaluate/history — lấy lịch sử của user đang login
        @GetMapping("/history")
        public ResponseEntity<?> getHistory(Authentication authentication) {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            List<Evaluation> history = evaluationRepository
                    .findByUserIdOrderByCreatedAtDesc(user.getId());
            
            return ResponseEntity.ok(history);
        }

}